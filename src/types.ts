export type PlaceCategory =
  | 'landmark'
  | 'coffee'
  | 'printing'
  | 'food'
  | 'study'
  | 'academic'

export type Need = 'coffee' | 'printing' | 'food' | 'study'

export interface CampusPlace {
  id: string
  name: string
  category: PlaceCategory
  lat: number
  lng: number
  taskMinutes: number
  description: string
  tags: string[]
}

export interface TripConstraints {
  startId: string
  destinationId: string
  availableMinutes: number
  needs: Need[]
}

export type RouteStatus = 'idle' | 'proposed' | 'approved'

export interface RouteStop {
  placeId: string
  name: string
  category: PlaceCategory
  role: 'start' | 'errand' | 'destination'
  taskMinutes: number
  walkMinutesFromPrevious: number
  lat: number
  lng: number
}

export interface DraftedRoute {
  stops: RouteStop[]
  walkingMinutes: number
  taskMinutes: number
  totalMinutes: number
  availableMinutes: number
  fitsInTime: boolean
  rationale: string
  googleMapsUrl: string
  appleMapsUrl: string
  createdAt: string
}

export interface AgentLogEntry {
  id: string
  tool: string
  timestamp: string
  input: unknown
  output: unknown
  status: 'ok' | 'error'
}

export interface WebMcpCapability {
  available: boolean
  source: 'document.modelContext' | 'navigator.modelContext' | null
  registeredTools: string[]
}
