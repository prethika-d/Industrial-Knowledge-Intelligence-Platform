const TONES = {
  success: 'bg-success/10 text-success border-success/25',
  signal: 'bg-signal-500/10 text-signal-400 border-signal-500/25',
  steel: 'bg-steel-500/10 text-steel-400 border-steel-500/25',
  danger: 'bg-danger/10 text-danger border-danger/25',
  neutral: 'bg-ink-700 text-paper-500 border-ink-600',
}

export default function Badge({ children, tone = 'neutral' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wide border ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
