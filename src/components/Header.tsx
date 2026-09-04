import { CAMPUS_DATA_NOTICE } from '../data/campus'
import { WebMcpStatus } from './WebMcpStatus'

export function Header() {
  return (
    <header className="animate-rise relative overflow-hidden border-b border-[var(--line)] pb-8">
      <div className="brand-rule absolute inset-x-0 top-0 h-1" />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="mb-2 text-sm font-semibold tracking-[0.18em] text-[var(--sjsu-blue)] uppercase">
            SJSU · Sample campus data
          </p>
          <h1 className="display text-4xl leading-[1.05] text-[var(--sjsu-blue-deep)] sm:text-5xl md:text-6xl">
            Wildcat Mission Planner
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[var(--ink-muted)] sm:text-lg">
            Turn a tight between-class window into an inspectable walking plan.
            Set your constraints; let an agent draft the route; approve before
            anything is final.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 lg:items-end">
          <WebMcpStatus />
          <p className="max-w-xs text-xs text-[var(--ink-muted)] lg:text-right">
            {CAMPUS_DATA_NOTICE}
          </p>
        </div>
      </div>
    </header>
  )
}
