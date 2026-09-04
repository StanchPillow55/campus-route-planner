import { useTripStore } from '../store/tripStore'

export function WebMcpStatus() {
  const webmcp = useTripStore((state) => state.webmcp)

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
      style={{
        borderColor: webmcp.available
          ? 'color-mix(in oklab, var(--ok) 40%, transparent)'
          : 'var(--line)',
        background: webmcp.available
          ? 'color-mix(in oklab, var(--ok) 12%, white)'
          : 'color-mix(in oklab, white 70%, var(--paper-2))',
      }}
      title={
        webmcp.available
          ? `Tools registered via ${webmcp.source}`
          : 'Enable Chrome WebMCP testing flag or use a WebMCP-capable agent browser'
      }
    >
      <span
        className="status-dot inline-block h-2 w-2 rounded-full"
        style={{
          background: webmcp.available ? 'var(--ok)' : 'var(--ink-muted)',
        }}
      />
      <span className="font-medium">
        WebMCP {webmcp.available ? 'ready' : 'unavailable'}
      </span>
      <span className="text-[var(--ink-muted)]">
        {webmcp.available
          ? webmcp.source
          : 'document.modelContext missing'}
      </span>
    </div>
  )
}
