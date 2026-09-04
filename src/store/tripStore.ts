import { create } from 'zustand'
import {
  DEFAULT_DESTINATION_ID,
  DEFAULT_START_ID,
} from '../data/campus'
import { draftCampusRoute } from '../lib/routing'
import type {
  AgentLogEntry,
  DraftedRoute,
  Need,
  RouteStatus,
  TripConstraints,
  WebMcpCapability,
} from '../types'

interface TripState {
  constraints: TripConstraints
  route: DraftedRoute | null
  status: RouteStatus
  agentLog: AgentLogEntry[]
  webmcp: WebMcpCapability
  setStartId: (id: string) => void
  setDestinationId: (id: string) => void
  setAvailableMinutes: (minutes: number) => void
  toggleNeed: (need: Need) => void
  setNeeds: (needs: Need[]) => void
  setConstraints: (partial: Partial<TripConstraints>) => void
  draftRoute: (overrides?: Partial<TripConstraints>) => DraftedRoute
  approveRoute: () => { ok: boolean; message: string }
  resetApproval: () => void
  clearRoute: () => void
  logAgentActivity: (entry: Omit<AgentLogEntry, 'id' | 'timestamp'>) => void
  setWebmcp: (capability: WebMcpCapability) => void
  getTripContext: () => {
    constraints: TripConstraints
    status: RouteStatus
    route: DraftedRoute | null
    notice: string
  }
}

function invalidateIfApproved(
  status: RouteStatus,
): RouteStatus {
  return status === 'approved' ? 'idle' : status
}

export const useTripStore = create<TripState>((set, get) => ({
  constraints: {
    startId: DEFAULT_START_ID,
    destinationId: DEFAULT_DESTINATION_ID,
    availableMinutes: 45,
    needs: ['coffee', 'printing', 'study'],
  },
  route: null,
  status: 'idle',
  agentLog: [],
  webmcp: {
    available: false,
    source: null,
    registeredTools: [],
  },

  setStartId: (id) =>
    set((state) => ({
      constraints: { ...state.constraints, startId: id },
      status: invalidateIfApproved(state.status),
      route: state.status === 'approved' ? null : state.route,
    })),

  setDestinationId: (id) =>
    set((state) => ({
      constraints: { ...state.constraints, destinationId: id },
      status: invalidateIfApproved(state.status),
      route: state.status === 'approved' ? null : state.route,
    })),

  setAvailableMinutes: (minutes) =>
    set((state) => ({
      constraints: {
        ...state.constraints,
        availableMinutes: Math.max(5, Math.min(180, Math.round(minutes))),
      },
      status: invalidateIfApproved(state.status),
      route: state.status === 'approved' ? null : state.route,
    })),

  toggleNeed: (need) =>
    set((state) => {
      const has = state.constraints.needs.includes(need)
      const needs = has
        ? state.constraints.needs.filter((item) => item !== need)
        : [...state.constraints.needs, need]
      return {
        constraints: { ...state.constraints, needs },
        status: invalidateIfApproved(state.status),
        route: state.status === 'approved' ? null : state.route,
      }
    }),

  setNeeds: (needs) =>
    set((state) => ({
      constraints: { ...state.constraints, needs },
      status: invalidateIfApproved(state.status),
      route: state.status === 'approved' ? null : state.route,
    })),

  setConstraints: (partial) =>
    set((state) => ({
      constraints: { ...state.constraints, ...partial },
      status: invalidateIfApproved(state.status),
      route: state.status === 'approved' ? null : state.route,
    })),

  draftRoute: (overrides) => {
    const constraints = { ...get().constraints, ...overrides }
    const route = draftCampusRoute(constraints)
    set({
      constraints,
      route,
      status: 'proposed',
    })
    return route
  },

  approveRoute: () => {
    const { route, status } = get()
    if (!route) {
      return { ok: false, message: 'No proposed route to approve. Draft a route first.' }
    }
    if (status !== 'proposed') {
      return {
        ok: false,
        message:
          status === 'approved'
            ? 'Route is already approved.'
            : 'Route must be in proposed state before approval.',
      }
    }
    set({ status: 'approved' })
    return {
      ok: true,
      message: 'Plan approved by the student. Mission is finalized.',
    }
  },

  resetApproval: () => set({ status: 'idle' }),

  clearRoute: () => set({ route: null, status: 'idle' }),

  logAgentActivity: (entry) =>
    set((state) => ({
      agentLog: [
        {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          ...entry,
        },
        ...state.agentLog,
      ].slice(0, 40),
    })),

  setWebmcp: (capability) => set({ webmcp: capability }),

  getTripContext: () => {
    const { constraints, status, route } = get()
    return {
      constraints,
      status,
      route,
      notice:
        'Routes stay proposed until the human clicks Approve plan. Agents must not treat a draft as final.',
    }
  },
}))
