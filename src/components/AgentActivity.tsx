import { runDemoTool } from '../lib/registerTools'
import { useTripStore } from '../store/tripStore'

export function AgentActivity() {
  const agentLog = useTripStore((state) => state.agentLog)
  const webmcp = useTripStore((state) => state.webmcp)

  async function simulateAgentPass() {
    await runDemoTool('get_trip_context')
    await runDemoTool('search_campus_places', {
      category: 'coffee',
      limit: 3,
    })
    await runDemoTool('draft_campus_route', {})
    await runDemoTool('get_walking_directions', {})
  }

  return (
    <section className="animate-rise-delay-2 rounded-2xl border border-[var(--line)] bg-[color-mix(in_oklab,var(--sjsu-blue-deep)_92%,black)] p-5 text-[color-mix(in_oklab,white_92%,var(--sjsu-gold))] sm:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="display text-2xl text-white">Agent activity</h2>
          <p className="mt-1 text-sm text-white/70">
            Visible tool calls — WebMCP executions update this panel live.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void simulateAgentPass()}
          className="rounded-xl bg-[var(--sjsu-gold)] px-3 py-2 text-sm font-bold text-[var(--sjsu-blue-deep)]"
        >
          Simulate agent tools
        </button>
      </div>

      <p className="mb-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/75">
        {webmcp.available
          ? `Registered: ${webmcp.registeredTools.join(', ')}`
          : 'WebMCP not detected in this browser. Use Simulate agent tools, or enable chrome://flags/#enable-webmcp-testing and reopen with a capable agent.'}
      </p>

      {agentLog.length === 0 ? (
        <p className="text-sm text-white/60">
          No tool calls yet. Draft a route or run the simulator.
        </p>
      ) : (
        <ul className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {agentLog.map((entry) => (
            <li
              key={entry.id}
              className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <code className="text-sm font-semibold text-[var(--sjsu-gold-soft)]">
                  {entry.tool}
                </code>
                <span
                  className="text-[10px] font-bold tracking-wide uppercase"
                  style={{
                    color: entry.status === 'ok' ? '#8dffb5' : '#ffb4b4',
                  }}
                >
                  {entry.status}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-white/45">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </p>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-white/75">
                {typeof entry.output === 'string'
                  ? entry.output
                  : JSON.stringify(entry.output, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
