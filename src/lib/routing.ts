import {
  CAMPUS_PLACES,
  NEED_TO_CATEGORY,
  getPlaceById,
} from '../data/campus'
import type {
  CampusPlace,
  DraftedRoute,
  Need,
  RouteStop,
  TripConstraints,
} from '../types'

/** Average campus walking pace ≈ 80 meters per minute. */
const WALK_METERS_PER_MINUTE = 80

export function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function walkMinutesBetween(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  return Math.max(1, Math.round(haversineMeters(a, b) / WALK_METERS_PER_MINUTE))
}

function buildMapsUrls(stops: RouteStop[]): { google: string; apple: string } {
  const coords = stops.map((stop) => `${stop.lat},${stop.lng}`)
  const origin = coords[0]
  const destination = coords[coords.length - 1]
  const waypoints = coords.slice(1, -1)

  const googleParams = new URLSearchParams({
    api: '1',
    origin,
    destination,
    travelmode: 'walking',
  })
  if (waypoints.length > 0) {
    googleParams.set('waypoints', waypoints.join('|'))
  }

  const appleParams = new URLSearchParams({
    saddr: origin,
    daddr: destination,
    dirflg: 'w',
  })

  return {
    google: `https://www.google.com/maps/dir/?${googleParams.toString()}`,
    apple: `https://maps.apple.com/?${appleParams.toString()}`,
  }
}

/**
 * Deterministic greedy planner:
 * 1. Resolve start + destination
 * 2. For each need, pick the unused place that least increases start→via→destination walk
 * 3. Order errands by nearest-neighbor from start toward destination
 */
export function draftCampusRoute(constraints: TripConstraints): DraftedRoute {
  const start = getPlaceById(constraints.startId)
  const destination = getPlaceById(constraints.destinationId)

  if (!start || !destination) {
    throw new Error('Start or destination location was not found in the campus registry.')
  }

  if (start.id === destination.id) {
    throw new Error('Start and destination must be different locations.')
  }

  const selectedErrands: CampusPlace[] = []
  const usedIds = new Set<string>([start.id, destination.id])

  for (const need of constraints.needs) {
    const category = NEED_TO_CATEGORY[need]
    const candidates = CAMPUS_PLACES.filter(
      (place) => place.category === category && !usedIds.has(place.id),
    )

    if (candidates.length === 0) {
      continue
    }

    const best = candidates
      .map((place) => {
        const detour =
          walkMinutesBetween(start, place) +
          walkMinutesBetween(place, destination) -
          walkMinutesBetween(start, destination)
        return { place, score: detour + place.taskMinutes * 0.15 }
      })
      .sort((a, b) => a.score - b.score || a.place.name.localeCompare(b.place.name))[0]

    selectedErrands.push(best.place)
    usedIds.add(best.place.id)
  }

  const orderedErrands: CampusPlace[] = []
  let cursor: CampusPlace = start
  const remaining = [...selectedErrands]

  while (remaining.length > 0) {
    remaining.sort((a, b) => {
      const aDist = walkMinutesBetween(cursor, a) + walkMinutesBetween(a, destination) * 0.35
      const bDist = walkMinutesBetween(cursor, b) + walkMinutesBetween(b, destination) * 0.35
      return aDist - bDist || a.name.localeCompare(b.name)
    })
    const next = remaining.shift()!
    orderedErrands.push(next)
    cursor = next
  }

  const pathPlaces: CampusPlace[] = [start, ...orderedErrands, destination]
  const stops: RouteStop[] = pathPlaces.map((place, index) => {
    const previous = index === 0 ? null : pathPlaces[index - 1]
    const walkMinutesFromPrevious = previous
      ? walkMinutesBetween(previous, place)
      : 0

    let role: RouteStop['role'] = 'errand'
    if (index === 0) role = 'start'
    if (index === pathPlaces.length - 1) role = 'destination'

    return {
      placeId: place.id,
      name: place.name,
      category: place.category,
      role,
      taskMinutes: role === 'errand' ? place.taskMinutes : 0,
      walkMinutesFromPrevious,
      lat: place.lat,
      lng: place.lng,
    }
  })

  const walkingMinutes = stops.reduce(
    (sum, stop) => sum + stop.walkMinutesFromPrevious,
    0,
  )
  const taskMinutes = stops.reduce((sum, stop) => sum + stop.taskMinutes, 0)
  const totalMinutes = walkingMinutes + taskMinutes
  const fitsInTime = totalMinutes <= constraints.availableMinutes

  const needList =
    constraints.needs.length > 0
      ? constraints.needs.join(', ')
      : 'no errands'
  const rationale = fitsInTime
    ? `Ordered ${orderedErrands.length} stop(s) for ${needList} using lowest-detour selection, then nearest-neighbor sequencing toward ${destination.name}.`
    : `Best feasible sequence still totals ${totalMinutes} min versus ${constraints.availableMinutes} min available — drop a need or allow more time.`

  const maps = buildMapsUrls(stops)

  return {
    stops,
    walkingMinutes,
    taskMinutes,
    totalMinutes,
    availableMinutes: constraints.availableMinutes,
    fitsInTime,
    rationale,
    googleMapsUrl: maps.google,
    appleMapsUrl: maps.apple,
    createdAt: new Date().toISOString(),
  }
}

export function describeNeeds(needs: Need[]): string {
  if (needs.length === 0) return 'none'
  return needs.join(', ')
}
