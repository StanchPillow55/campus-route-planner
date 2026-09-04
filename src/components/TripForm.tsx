import {
  CAMPUS_PLACES,
  NEED_LABELS,
} from '../data/campus'
import { useTripStore } from '../store/tripStore'
import type { Need } from '../types'

const NEEDS: Need[] = ['coffee', 'printing', 'food', 'study']

export function TripForm() {
  const constraints = useTripStore((state) => state.constraints)
  const setStartId = useTripStore((state) => state.setStartId)
  const setDestinationId = useTripStore((state) => state.setDestinationId)
  const setAvailableMinutes = useTripStore((state) => state.setAvailableMinutes)
  const toggleNeed = useTripStore((state) => state.toggleNeed)
  const draftRoute = useTripStore((state) => state.draftRoute)
  const logAgentActivity = useTripStore((state) => state.logAgentActivity)

  function handleDraft() {
    try {
      const route = draftRoute()
      logAgentActivity({
        tool: 'ui.draft_campus_route',
        input: constraints,
        output: `Proposed ${route.stops.length} stops · ${route.totalMinutes} min total`,
        status: 'ok',
      })
    } catch (error) {
      logAgentActivity({
        tool: 'ui.draft_campus_route',
        input: constraints,
        output: error instanceof Error ? error.message : String(error),
        status: 'error',
      })
    }
  }

  return (
    <section className="animate-rise-delay rounded-2xl border border-[var(--line)] bg-white/80 p-5 shadow-[var(--shadow)] backdrop-blur sm:p-6">
      <div className="mb-5">
        <h2 className="display text-2xl text-[var(--sjsu-blue-deep)]">
          Trip constraints
        </h2>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          Human-editable inputs the agent reads via <code>get_trip_context</code>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Starting location</span>
          <select
            className="rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 outline-none focus:border-[var(--sjsu-blue)]"
            value={constraints.startId}
            onChange={(event) => setStartId(event.target.value)}
          >
            {CAMPUS_PLACES.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Destination</span>
          <select
            className="rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 outline-none focus:border-[var(--sjsu-blue)]"
            value={constraints.destinationId}
            onChange={(event) => setDestinationId(event.target.value)}
          >
            {CAMPUS_PLACES.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium">
            Available time · {constraints.availableMinutes} minutes
          </span>
          <input
            type="range"
            min={10}
            max={120}
            step={5}
            value={constraints.availableMinutes}
            onChange={(event) =>
              setAvailableMinutes(Number(event.target.value))
            }
            className="accent-[var(--sjsu-blue)]"
          />
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-medium">Needs</legend>
        <div className="flex flex-wrap gap-2">
          {NEEDS.map((need) => {
            const active = constraints.needs.includes(need)
            return (
              <button
                key={need}
                type="button"
                onClick={() => toggleNeed(need)}
                className="rounded-xl border px-3 py-2 text-sm transition"
                style={{
                  borderColor: active
                    ? 'var(--sjsu-blue)'
                    : 'var(--line)',
                  background: active
                    ? 'color-mix(in oklab, var(--sjsu-blue) 12%, white)'
                    : 'var(--paper)',
                  color: active ? 'var(--sjsu-blue-deep)' : 'var(--ink)',
                  fontWeight: active ? 600 : 500,
                }}
                aria-pressed={active}
              >
                {NEED_LABELS[need]}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleDraft}
          className="rounded-xl bg-[var(--sjsu-blue)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--sjsu-blue-deep)]"
        >
          Draft route now
        </button>
        <p className="self-center text-xs text-[var(--ink-muted)]">
          Or ask an agent to call <code>draft_campus_route</code>.
        </p>
      </div>
    </section>
  )
}
