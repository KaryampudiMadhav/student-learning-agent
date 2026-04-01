import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

export function StreakBadge({ streak = 0, animate = true }) {
  const hasStreak = streak > 0

  return (
    <motion.div
      initial={animate ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition-all ${
        hasStreak
          ? 'border border-orange-400/50 bg-gradient-to-r from-orange-500/20 to-red-500/10 text-orange-300 shadow-lg shadow-orange-500/20'
          : 'border border-slate-500/30 bg-slate-800/40 text-slate-400'
      }`}
    >
      {hasStreak && (
        <>
          <motion.div
            animate={animate ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center"
          >
            <Flame className="h-4 w-4" />
          </motion.div>
          <span className="text-sm">{streak} Day Streak</span>
          {streak >= 7 && (
            <span className="ml-1 text-xs font-bold">🔥 </span>
          )}
        </>
      )}
      {!hasStreak && (
        <>
          <Flame className="h-4 w-4" />
          <span className="text-sm">Start your streak</span>
        </>
      )}

      {hasStreak && (
        <motion.div
          className="absolute inset-0 rounded-full bg-orange-400/10 blur-xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  )
}
