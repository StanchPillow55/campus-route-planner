import type { Need, PlaceCategory } from '../types'

export interface ModelContextToolDefinition {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  annotations?: {
    readOnlyHint?: boolean
    untrustedContentHint?: boolean
    consequentialHint?: boolean
  }
  execute: (
    args: Record<string, unknown>,
    options?: { signal?: AbortSignal },
  ) => Promise<unknown> | unknown
}

export interface ModelContext {
  registerTool: (
    tool: ModelContextToolDefinition,
    options?: { signal?: AbortSignal; exposedTo?: string[] },
  ) => Promise<void> | void
  getTools?: () => Promise<unknown[]>
  executeTool?: (
    tool: unknown,
    input: string,
    options?: { signal?: AbortSignal },
  ) => Promise<unknown>
  addEventListener?: (
    type: string,
    listener: EventListenerOrEventListenerObject,
  ) => void
}

declare global {
  interface Document {
    modelContext?: ModelContext
  }

  interface Navigator {
    modelContext?: ModelContext
  }
}

export function getModelContext(): ModelContext | null {
  if (typeof document !== 'undefined' && document.modelContext) {
    return document.modelContext
  }
  if (typeof navigator !== 'undefined' && navigator.modelContext) {
    return navigator.modelContext
  }
  return null
}

export function getModelContextSource():
  | 'document.modelContext'
  | 'navigator.modelContext'
  | null {
  if (typeof document !== 'undefined' && document.modelContext) {
    return 'document.modelContext'
  }
  if (typeof navigator !== 'undefined' && navigator.modelContext) {
    return 'navigator.modelContext'
  }
  return null
}

export const NEED_ENUM: Need[] = ['coffee', 'printing', 'food', 'study']

export const CATEGORY_ENUM: Array<PlaceCategory | Need | 'any'> = [
  'any',
  'landmark',
  'coffee',
  'printing',
  'food',
  'study',
  'academic',
]
