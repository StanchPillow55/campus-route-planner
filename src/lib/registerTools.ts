import { useEffect } from 'react'
import { searchPlaces, CAMPUS_DATA_NOTICE, getPlaceById } from '../data/campus'
import { useTripStore } from '../store/tripStore'
import type { Need, PlaceCategory } from '../types'
import {
  CATEGORY_ENUM,
  NEED_ENUM,
  getModelContext,
  getModelContextSource,
  type ModelContextToolDefinition,
} from './webmcp'

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function asNeedArray(value: unknown): Need[] | undefined {
  if (!Array.isArray(value)) return undefined
  return value.filter((item): item is Need => NEED_ENUM.includes(item as Need))
}

function summarize(value: unknown, max = 280): string {
  try {
    const text = typeof value === 'string' ? value : JSON.stringify(value)
    return text.length > max ? `${text.slice(0, max)}…` : text
  } catch {
    return String(value)
  }
}

async function withLogging<T>(
  tool: string,
  input: unknown,
  run: () => Promise<T> | T,
): Promise<T> {
  const log = useTripStore.getState().logAgentActivity
  try {
    const output = await run()
    log({
      tool,
      input,
      output: summarize(output),
      status: 'ok',
    })
    return output
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    log({
      tool,
      input,
      output: message,
      status: 'error',
    })
    throw error
  }
}

function buildTools(): ModelContextToolDefinition[] {
  return [
    {
      name: 'get_trip_context',
      description:
        'Read the student’s current trip constraints (start, destination, available minutes, needs), route approval status, and any proposed or approved route. Always call this before drafting so you respect the latest form values. Routes are never final until the human approves.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
        consequentialHint: false,
        untrustedContentHint: false,
      },
      execute: async () =>
        withLogging('get_trip_context', {}, () => {
          const context = useTripStore.getState().getTripContext()
          return {
            ...context,
            dataNotice: CAMPUS_DATA_NOTICE,
          }
        }),
    },
    {
      name: 'search_campus_places',
      description:
        'Search the sample SJSU campus location registry by free-text query and/or category (coffee, printing, food, study, landmark, academic). Returns matching places with coordinates, task minutes, and descriptions.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Optional search text matching name, tags, or description.',
          },
          category: {
            type: 'string',
            enum: CATEGORY_ENUM,
            description: 'Optional category or need filter. Use "any" for all.',
          },
          limit: {
            type: 'number',
            description: 'Max results to return (1–12). Defaults to 10.',
            minimum: 1,
            maximum: 12,
          },
        },
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
        consequentialHint: false,
        untrustedContentHint: false,
      },
      execute: async (args) =>
        withLogging('search_campus_places', args, () => {
          const query = asString(args.query)
          const category = asString(args.category) as
            | PlaceCategory
            | Need
            | 'any'
            | undefined
          const limit = asNumber(args.limit)
          const places = searchPlaces({ query, category, limit })
          return {
            count: places.length,
            dataNotice: CAMPUS_DATA_NOTICE,
            places,
          }
        }),
    },
    {
      name: 'draft_campus_route',
      description:
        'Draft an optimized walking route using deterministic client-side logic. Optionally override startId, destinationId, availableMinutes, or needs. Updates the visible route card as a PROPOSED plan only — never finalizes. The student must click Approve plan.',
      inputSchema: {
        type: 'object',
        properties: {
          startId: {
            type: 'string',
            description: 'Optional starting place id from the campus registry.',
          },
          destinationId: {
            type: 'string',
            description: 'Optional destination place id from the campus registry.',
          },
          availableMinutes: {
            type: 'number',
            description: 'Optional available minutes before class (5–180).',
            minimum: 5,
            maximum: 180,
          },
          needs: {
            type: 'array',
            description: 'Optional errand needs to satisfy along the walk.',
            items: { type: 'string', enum: NEED_ENUM },
          },
        },
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: false,
        consequentialHint: false,
        untrustedContentHint: false,
      },
      execute: async (args) =>
        withLogging('draft_campus_route', args, () => {
          const overrides: {
            startId?: string
            destinationId?: string
            availableMinutes?: number
            needs?: Need[]
          } = {}

          const startId = asString(args.startId)
          const destinationId = asString(args.destinationId)
          const availableMinutes = asNumber(args.availableMinutes)
          const needs = asNeedArray(args.needs)

          if (startId) {
            if (!getPlaceById(startId)) {
              throw new Error(`Unknown startId: ${startId}`)
            }
            overrides.startId = startId
          }
          if (destinationId) {
            if (!getPlaceById(destinationId)) {
              throw new Error(`Unknown destinationId: ${destinationId}`)
            }
            overrides.destinationId = destinationId
          }
          if (availableMinutes !== undefined) {
            overrides.availableMinutes = availableMinutes
          }
          if (needs) {
            overrides.needs = needs
          }

          const route = useTripStore.getState().draftRoute(overrides)
          return {
            status: 'proposed',
            approvalRequired: true,
            message:
              'Route drafted and shown in the UI as proposed. Do not finalize — wait for the student to approve.',
            dataNotice: CAMPUS_DATA_NOTICE,
            route,
          }
        }),
    },
    {
      name: 'get_walking_directions',
      description:
        'Return Google Maps and Apple Maps walking direction links for the current proposed or approved route. If no route exists, drafts one first from the current trip context (still proposed only).',
      inputSchema: {
        type: 'object',
        properties: {
          redraftIfMissing: {
            type: 'boolean',
            description:
              'When true (default), draft a route if none exists before returning map links.',
          },
        },
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: false,
        consequentialHint: false,
        untrustedContentHint: false,
      },
      execute: async (args) =>
        withLogging('get_walking_directions', args, () => {
          const state = useTripStore.getState()
          let route = state.route
          const redraftIfMissing = args.redraftIfMissing !== false

          if (!route && redraftIfMissing) {
            route = state.draftRoute()
          }

          if (!route) {
            throw new Error(
              'No route available. Call draft_campus_route first or set redraftIfMissing to true.',
            )
          }

          return {
            status: useTripStore.getState().status,
            walkingMinutes: route.walkingMinutes,
            taskMinutes: route.taskMinutes,
            totalMinutes: route.totalMinutes,
            stopNames: route.stops.map((stop) => stop.name),
            googleMapsUrl: route.googleMapsUrl,
            appleMapsUrl: route.appleMapsUrl,
            approvalRequired: useTripStore.getState().status !== 'approved',
            dataNotice: CAMPUS_DATA_NOTICE,
          }
        }),
    },
  ]
}

/**
 * Registers WebMCP tools when the browser exposes modelContext.
 * Uses AbortSignal for cleanup on unmount (no unregisterTool in current API).
 */
export function useRegisterWebMcpTools() {
  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    async function register() {
      const modelContext = getModelContext()
      const source = getModelContextSource()
      const tools = buildTools()
      const names = tools.map((tool) => tool.name)

      if (!modelContext || typeof modelContext.registerTool !== 'function') {
        useTripStore.getState().setWebmcp({
          available: false,
          source: null,
          registeredTools: [],
        })
        return
      }

      try {
        for (const tool of tools) {
          if (cancelled) return
          await modelContext.registerTool(tool, { signal: controller.signal })
        }
        if (cancelled) return
        useTripStore.getState().setWebmcp({
          available: true,
          source,
          registeredTools: names,
        })
        useTripStore.getState().logAgentActivity({
          tool: 'webmcp.register',
          input: { tools: names, source },
          output: `Registered ${names.length} tools via ${source}`,
          status: 'ok',
        })
      } catch (error) {
        if (cancelled || controller.signal.aborted) return
        useTripStore.getState().setWebmcp({
          available: false,
          source,
          registeredTools: [],
        })
        useTripStore.getState().logAgentActivity({
          tool: 'webmcp.register',
          input: { tools: names },
          output: error instanceof Error ? error.message : String(error),
          status: 'error',
        })
      }
    }

    void register()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])
}

/** Manual tool runners for demos when WebMCP is unavailable. */
export async function runDemoTool(
  name: 'get_trip_context' | 'search_campus_places' | 'draft_campus_route' | 'get_walking_directions',
  args: Record<string, unknown> = {},
) {
  const tool = buildTools().find((item) => item.name === name)
  if (!tool) throw new Error(`Unknown tool: ${name}`)
  return tool.execute(args)
}
