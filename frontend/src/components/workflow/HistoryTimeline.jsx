import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, RotateCcw, TrendingUp } from 'lucide-react'

export function HistoryTimeline({ history = [] }) {
  if (!history || history.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-700/40 bg-slate-900/30 p-12">
        <div className="text-center">
          <TrendingUp className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <p className="text-sm text-slate-400">No learning history yet</p>
          <p className="text-xs text-slate-500 mt-1">Start a learning session to see your progress</p>
        </div>
      </div>
    )
  }

  const getStatusIcon = (item) => {
    if (item.status === 'completed' || (item.score && item.score >= 75)) {
      return <CheckCircle2 className="h-5 w-5 text-green-400" />
    }
    if (item.status === 'repeat' || (item.score && item.score < 50)) {
      return <RotateCcw className="h-5 w-5 text-orange-400" />
    }
    return <AlertCircle className="h-5 w-5 text-yellow-400" />
  }

  const getStatusColor = (item) => {
    if (item.status === 'completed' || (item.score && item.score >= 75)) {
      return 'border-green-400/30 bg-green-950/20'
    }
    if (item.status === 'repeat' || (item.score && item.score < 50)) {
      return 'border-orange-400/30 bg-orange-950/20'
    }
    return 'border-yellow-400/30 bg-yellow-950/20'
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-orange-400'
  }

  return (
    <div className="relative space-y-6">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500/50 via-blue-500/30 to-cyan-500/10" />

      {/* Timeline items */}
      <div className="space-y-6">
        {history.map((item, index) => {
          const day = item.day || `Day ${index + 1}`
          const topic = item.topic || 'Learning'
          const score = item.score
          const date = item.date ? new Date(item.date).toLocaleDateString() : ''

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.1,
                type: 'spring',
                stiffness: 100,
              }}
              className="relative ml-16"
            >
              {/* Timeline dot */}
              <motion.div
                className="absolute -left-12 top-1 h-9 w-9 rounded-full border-4 border-slate-950 bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center"
                whileHover={{ scale: 1.2 }}
              >
                <div className="h-2 w-2 rounded-full bg-white" />
              </motion.div>

              {/* Card */}
              <motion.div
                whileHover={{ scale: 1.02, translateX: 4 }}
                className={`rounded-xl border px-5 py-4 backdrop-blur-sm transition-all ${getStatusColor(
                  item
                )}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">{day}</h3>
                    <p className="text-xs text-slate-300 mt-0.5">{topic}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item)}
                  </div>
                </div>

                {/* Score and metadata */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-4">
                    {score !== undefined && (
                      <div>
                        <p className="text-xs text-slate-400">Score</p>
                        <p className={`text-lg font-bold ${getScoreColor(score)}`}>
                          {score}%
                        </p>
                      </div>
                    )}
                  </div>
                  {date && (
                    <p className="text-xs text-slate-500">{date}</p>
                  )}
                </div>

                {/* Status badge */}
                {item.status && (
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                      {item.status === 'completed' && '✅ Completed'}
                      {item.status === 'repeat' && '🔁 Needs Revision'}
                      {!item.status && '📚 In Progress'}
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
