export function LoadingSkeleton({ className = '' }) {
  return (
    <div
      className={`rounded-xl bg-linear-to-r from-slate-800 via-slate-700 to-slate-800 bg-size-[200%_100%] animate-[shimmer_1.8s_linear_infinite] ${className}`}
    />
  )
}
