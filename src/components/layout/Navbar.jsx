import { FiSearch, FiBell } from 'react-icons/fi'

function useToday() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function Navbar({ title = 'Overview', subtitle }) {
  const today = useToday()

  return (
    <header className="sticky top-0 z-10 h-20 flex items-center justify-between gap-6 px-6 lg:px-8 bg-ink-900/85 backdrop-blur border-b border-ink-600">
      <div className="min-w-0">
        <h1 className="font-display text-xl font-semibold text-paper-100 truncate">{title}</h1>
        <p className="text-xs text-paper-500 mt-0.5">{subtitle ?? today}</p>
      </div>

      <div className="flex items-center gap-3 lg:gap-4">
        <div className="hidden md:flex items-center gap-2 bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 w-64 focus-within:border-steel-500/50 transition-colors">
          <FiSearch size={15} className="text-paper-500 shrink-0" />
          <input
            type="text"
            placeholder="Search documents, reports..."
            className="bg-transparent outline-none text-sm text-paper-100 placeholder:text-paper-500 w-full"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative w-10 h-10 rounded-lg bg-ink-800 border border-ink-600 flex items-center justify-center text-paper-500 hover:text-paper-100 hover:border-ink-500 transition-colors"
        >
          <FiBell size={17} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-signal-500" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-ink-600">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-paper-100 leading-tight">Arun Kumar</p>
            <p className="text-[11px] text-paper-500 leading-tight">Plant Engineer</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-steel-500 to-steel-600 flex items-center justify-center font-display font-semibold text-sm text-onaccent">
            AK
          </div>
        </div>
      </div>
    </header>
  )
}
