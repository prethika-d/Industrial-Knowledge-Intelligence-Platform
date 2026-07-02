export default function Section({ eyebrow, title, action, children, className = '' }) {
  return (
    <section className={`panel p-6 ${className}`}>
      {(eyebrow || title || action) && (
        <div className="flex items-center justify-between mb-5">
          <div>
            {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
            {title && <h2 className="font-display text-base font-semibold text-paper-100">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
