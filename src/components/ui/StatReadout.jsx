export default function StatReadout({ label, value, unit, delta, deltaTone = 'success', icon: Icon }) {
  const toneMap = {
    success: 'text-success',
    danger: 'text-danger',
    neutral: 'text-paper-500',
  }

  return (
    <div className="bracket-frame panel p-5">
      <div className="flex items-start justify-between mb-4">
        <span className="eyebrow">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-md bg-ink-700 border border-ink-600 flex items-center justify-center text-steel-400">
            <Icon size={15} />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="readout text-3xl font-semibold text-paper-100">{value}</span>
        {unit && <span className="readout text-sm text-paper-500">{unit}</span>}
      </div>
      {delta && (
        <p className={`readout text-xs mt-2 ${toneMap[deltaTone]}`}>{delta}</p>
      )}
    </div>
  )
}
