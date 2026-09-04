import type { CampusPlace, Need, PlaceCategory } from '../types'

/**
 * Sample campus data for demo purposes only.
 * Coordinates approximate SJSU downtown San Jose landmarks — not official university data.
 */
export const CAMPUS_DATA_NOTICE =
  'Sample campus data — fictionalized for demo. Not affiliated with or sourced from live SJSU systems.'

export const NEED_TO_CATEGORY: Record<Need, PlaceCategory> = {
  coffee: 'coffee',
  printing: 'printing',
  food: 'food',
  study: 'study',
}

export const NEED_LABELS: Record<Need, string> = {
  coffee: 'Coffee',
  printing: 'Printing',
  food: 'Food',
  study: 'Quiet study',
}

export const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  landmark: 'Landmark',
  coffee: 'Coffee',
  printing: 'Printing',
  food: 'Food',
  study: 'Study',
  academic: 'Academic',
}

export const CAMPUS_PLACES: CampusPlace[] = [
  {
    id: 'student-union',
    name: 'Student Union',
    category: 'landmark',
    lat: 37.3362,
    lng: -121.8813,
    taskMinutes: 0,
    description: 'Campus hub with food court, lounges, and event spaces.',
    tags: ['start', 'meetup', 'hub'],
  },
  {
    id: 'engineering',
    name: 'Engineering Building',
    category: 'academic',
    lat: 37.3371,
    lng: -121.8819,
    taskMinutes: 0,
    description: 'Home to engineering classrooms and labs on the north edge of campus.',
    tags: ['class', 'destination', 'STEM'],
  },
  {
    id: 'mlk-library',
    name: 'Dr. Martin Luther King Jr. Library',
    category: 'study',
    lat: 37.3354,
    lng: -121.8851,
    taskMinutes: 12,
    description: 'Quiet upper floors and deep stacks — best for focused study.',
    tags: ['quiet', 'study', 'library'],
  },
  {
    id: 'campus-village',
    name: 'Campus Village Commons Café',
    category: 'coffee',
    lat: 37.3346,
    lng: -121.8789,
    taskMinutes: 6,
    description: 'Quick espresso and pastries near residence halls.',
    tags: ['coffee', 'espresso', 'grab-and-go'],
  },
  {
    id: 'spartan-print',
    name: 'Spartan Print Center',
    category: 'printing',
    lat: 37.3358,
    lng: -121.8804,
    taskMinutes: 8,
    description: 'Walk-up printing, scanning, and binding near the Academic Services corridor.',
    tags: ['printer', 'print', 'scan'],
  },
  {
    id: 'bbc',
    name: 'Boccardo Business Complex Café',
    category: 'coffee',
    lat: 37.3368,
    lng: -121.8801,
    taskMinutes: 5,
    description: 'Reliable drip coffee and short lines between classes.',
    tags: ['coffee', 'business', 'quick'],
  },
  {
    id: 'dining-commons',
    name: 'Dining Commons',
    category: 'food',
    lat: 37.3341,
    lng: -121.8796,
    taskMinutes: 15,
    description: 'Full meals and refill stations — slower but filling.',
    tags: ['food', 'meals', 'lunch'],
  },
  {
    id: 'yoshihiro',
    name: 'Yoshihiro Uchida Hall Study Nook',
    category: 'study',
    lat: 37.3359,
    lng: -121.8827,
    taskMinutes: 10,
    description: 'Small quiet corners ideal for a short review session.',
    tags: ['quiet', 'study', 'nook'],
  },
  {
    id: 'tower-hall-print',
    name: 'Tower Hall Print Kiosk',
    category: 'printing',
    lat: 37.3352,
    lng: -121.8822,
    taskMinutes: 5,
    description: 'Self-serve print kiosk with card release — fastest print stop.',
    tags: ['printer', 'kiosk', 'fast'],
  },
  {
    id: 'paseo-bites',
    name: 'Paseo Food Walk',
    category: 'food',
    lat: 37.3338,
    lng: -121.8834,
    taskMinutes: 12,
    description: 'Street-facing bites just off campus — sandwiches and bowls.',
    tags: ['food', 'quick-eat', 'off-campus-edge'],
  },
]

export const DEFAULT_START_ID = 'student-union'
export const DEFAULT_DESTINATION_ID = 'engineering'

export function getPlaceById(id: string): CampusPlace | undefined {
  return CAMPUS_PLACES.find((place) => place.id === id)
}

export function searchPlaces(options: {
  query?: string
  category?: PlaceCategory | Need | 'any'
  limit?: number
}): CampusPlace[] {
  const query = options.query?.trim().toLowerCase() ?? ''
  const limit = options.limit ?? 10
  let categoryFilter: PlaceCategory | undefined

  if (options.category && options.category !== 'any') {
    categoryFilter =
      options.category in NEED_TO_CATEGORY
        ? NEED_TO_CATEGORY[options.category as Need]
        : (options.category as PlaceCategory)
  }

  return CAMPUS_PLACES.filter((place) => {
    const matchesCategory = categoryFilter ? place.category === categoryFilter : true
    if (!matchesCategory) return false
    if (!query) return true
    const haystack = [
      place.name,
      place.description,
      place.category,
      ...place.tags,
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(query)
  }).slice(0, limit)
}
