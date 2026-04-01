import { motion } from 'framer-motion'
import { GlassCard } from '../common/GlassCard'

void motion

export function MetricCard({ icon: Icon, title, value, subtitle, accent = 'from-cyan-400 to-blue-500' }) {
  void Icon

  return (
    <GlassCard className="relative overflow-hidden" hover>
      <motion.div
        className={`pointer-events-none absolute inset-0 bg-linear-to-br ${accent} opacity-10`}
        animate={{ opacity: [0.08, 0.16, 0.08] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
      />
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</p>
          <Icon className="h-5 w-5 text-cyan-200" />
        </div>
        <p className="text-3xl font-semibold text-white">{value}</p>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>
    </GlassCard>
  )
}
