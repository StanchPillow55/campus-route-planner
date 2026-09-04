import { Header } from './components/Header'
import { TripForm } from './components/TripForm'
import { LocationList } from './components/LocationList'
import { RouteCard } from './components/RouteCard'
import { AgentActivity } from './components/AgentActivity'
import { useRegisterWebMcpTools } from './lib/registerTools'

export default function App() {
  useRegisterWebMcpTools()

  return (
    <div className="relative mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Header />

      <main className="mt-8 grid gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <TripForm />
          <AgentActivity />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-7">
          <RouteCard />
          <LocationList />
        </div>
      </main>

      <footer className="mt-10 border-t border-[var(--line)] pt-5 text-sm text-[var(--ink-muted)]">
        <p>
          Wildcat Mission Planner · WebMCP demo · MIT License · Not an official
          SJSU product.
        </p>
      </footer>
    </div>
  )
}
