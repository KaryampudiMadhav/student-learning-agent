import { motion } from 'framer-motion'

export function ProgressBar({ current = 0, total = 10, topic = '' }) {
  const percentage = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Progress</h3>
          {topic && <p className="text-xs text-slate-400">{topic}</p>}
        </div>
        <span className="text-xs font-bold text-cyan-300">
          {current}/{total}
        </span>
      </div>

      <div className="relative h-3 overflow-hidden rounded-full bg-slate-800/60 backdrop-blur-sm">
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Progress bar */}
        <motion.div
          className="relative h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Inner shine */}
          <div className="absolute inset-0 rounded-full bg-white/20" />
        </motion.div>
      </div>

      {/* Percentage text */}
      <div className="flex justify-between text-xs text-slate-400">
        <span>Day {current}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
    </div>
  )
}
