import { CATEGORY_LABELS } from '../data/campus'
import { useTripStore } from '../store/tripStore'

export function RouteCard() {
  const route = useTripStore((state) => state.route)
  const status = useTripStore((state) => state.status)
  const approveRoute = useTripStore((state) => state.approveRoute)
  const clearRoute = useTripStore((state) => state.clearRoute)
  const logAgentActivity = useTripStore((state) => state.logAgentActivity)

  function handleApprove() {
    const result = approveRoute()
    logAgentActivity({
      tool: 'ui.approve_plan',
      input: { statusBefore: 'proposed' },
      output: result.message,
      status: result.ok ? 'ok' : 'error',
    })
  }

  if (!route) {
    return (
      <section className="animate-rise-delay-2 rounded-2xl border border-dashed border-[var(--line)] bg-white/50 p-5 sm:p-6">
        <h2 className="display text-2xl text-[var(--sjsu-blue-deep)]">
          Proposed route
        </h2>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          No plan yet. Draft from the form or have an agent call{' '}
          <code>draft_campus_route</code>. Nothing is finalized until you
          approve.
        </p>
      </section>
    )
  }

  const statusLabel =
    status === 'approved'
      ? 'Approved'
      : status === 'proposed'
        ? 'Proposed — awaiting approval'
        : 'Draft'

  const statusColor =
    status === 'approved'
      ? 'var(--ok)'
      : route.fitsInTime
        ? 'var(--sjsu-blue)'
        : 'var(--warn)'

  return (
    <section className="animate-rise-delay-2 rounded-2xl border border-[var(--line)] bg-white/90 p-5 shadow-[var(--shadow)] sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="display text-2xl text-[var(--sjsu-blue-deep)]">
            Proposed route
          </h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">{route.rationale}</p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold text-white"
          style={{ background: statusColor }}
        >
          {statusLabel}
        </span>
      </div>

      <ol className="space-y-3">
        {route.stops.map((stop, index) => (
          <li key={`${stop.placeId}-${index}`} className="flex gap-3">
            <div
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{
                background:
                  stop.role === 'destination'
                    ? 'var(--sjsu-gold)'
                    : 'var(--sjsu-blue)',
                color: stop.role === 'destination' ? 'var(--sjsu-blue-deep)' : undefined,
              }}
            >
              {index + 1}
            </div>
            <div className="min-w-0 flex-1 border-b border-[var(--line)] pb-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">{stop.name}</p>
                <p className="text-xs text-[var(--ink-muted)]">
                  {stop.role === 'start'
                    ? 'Start'
                    : stop.role === 'destination'
                      ? 'Destination'
                      : CATEGORY_LABELS[stop.category]}
                </p>
              </div>
              <p className="text-sm text-[var(--ink-muted)]">
                {stop.walkMinutesFromPrevious > 0
                  ? `${stop.walkMinutesFromPrevious} min walk`
                  : 'Origin'}
                {stop.taskMinutes > 0 ? ` · ${stop.taskMinutes} min task` : ''}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-[var(--paper)] px-2 py-3">
          <p className="text-xs tracking-wide text-[var(--ink-muted)] uppercase">
            Walking
          </p>
          <p className="display text-2xl text-[var(--sjsu-blue-deep)]">
            {route.walkingMinutes}
            <span className="text-sm font-sans font-medium"> min</span>
          </p>
        </div>
        <div className="rounded-xl bg-[var(--paper)] px-2 py-3">
          <p className="text-xs tracking-wide text-[var(--ink-muted)] uppercase">
            Tasks
          </p>
          <p className="display text-2xl text-[var(--sjsu-blue-deep)]">
            {route.taskMinutes}
            <span className="text-sm font-sans font-medium"> min</span>
          </p>
        </div>
        <div className="rounded-xl bg-[color-mix(in_oklab,var(--sjsu-gold)_22%,white)] px-2 py-3">
          <p className="text-xs tracking-wide text-[var(--ink-muted)] uppercase">
            Total
          </p>
          <p className="display text-2xl text-[var(--sjsu-blue-deep)]">
            {route.totalMinutes}
            <span className="text-sm font-sans font-medium"> min</span>
          </p>
        </div>
      </div>

      <p
        className="mt-3 text-sm"
        style={{ color: route.fitsInTime ? 'var(--ok)' : 'var(--warn)' }}
      >
        {route.fitsInTime
          ? `Fits in your ${route.availableMinutes}-minute window with ${route.availableMinutes - route.totalMinutes} min buffer.`
          : `Over by ${route.totalMinutes - route.availableMinutes} min versus your ${route.availableMinutes}-minute window.`}
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleApprove}
          disabled={status !== 'proposed'}
          className="rounded-xl bg-[var(--sjsu-gold)] px-4 py-2.5 text-sm font-bold text-[var(--sjsu-blue-deep)] transition enabled:hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {status === 'approved' ? 'Plan approved' : 'Approve plan'}
        </button>
        <a
          href={route.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--sjsu-blue-deep)] transition hover:border-[var(--sjsu-blue)]"
        >
          Google Maps
        </a>
        <a
          href={route.appleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--sjsu-blue-deep)] transition hover:border-[var(--sjsu-blue)]"
        >
          Apple Maps
        </a>
        <button
          type="button"
          onClick={() => {
            clearRoute()
            logAgentActivity({
              tool: 'ui.clear_route',
              input: {},
              output: 'Cleared proposed/approved route',
              status: 'ok',
            })
          }}
          className="rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--ink-muted)] underline-offset-2 hover:underline"
        >
          Clear
        </button>
      </div>

      {status === 'proposed' && (
        <p className="mt-3 text-xs text-[var(--ink-muted)]">
          Agents can draft and inspect this plan, but only you can finalize it.
        </p>
      )}
    </section>
  )
}
