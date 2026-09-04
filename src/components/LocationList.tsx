import { CAMPUS_PLACES, CATEGORY_LABELS } from '../data/campus'

export function LocationList() {
  return (
    <section className="animate-rise-delay rounded-2xl border border-[var(--line)] bg-white/70 p-5 backdrop-blur sm:p-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="display text-2xl text-[var(--sjsu-blue-deep)]">
            Campus registry
          </h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            {CAMPUS_PLACES.length} sample locations agents can search.
          </p>
        </div>
        <span className="rounded-full bg-[color-mix(in_oklab,var(--sjsu-gold)_28%,white)] px-2.5 py-1 text-xs font-semibold text-[var(--sjsu-blue-deep)]">
          Sample data
        </span>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {CAMPUS_PLACES.map((place) => (
          <li
            key={place.id}
            className="border-b border-[var(--line)] pb-3 last:border-b-0 sm:border-0 sm:pb-0"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-[var(--ink)]">{place.name}</p>
                <p className="text-xs font-medium tracking-wide text-[var(--sjsu-blue)] uppercase">
                  {CATEGORY_LABELS[place.category]}
                  {place.taskMinutes > 0 ? ` · ~${place.taskMinutes} min task` : ''}
                </p>
              </div>
              <code className="shrink-0 rounded bg-[var(--paper)] px-1.5 py-0.5 text-[10px] text-[var(--ink-muted)]">
                {place.id}
              </code>
            </div>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">
              {place.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
