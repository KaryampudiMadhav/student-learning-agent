import { motion } from 'framer-motion'
import { Check, Square } from 'lucide-react'
import { useState } from 'react'

export function TaskChecklist({ tasks = [], onTaskComplete = null }) {
  const [completedTasks, setCompletedTasks] = useState(new Set())

  const handleTaskToggle = (index) => {
    const newCompleted = new Set(completedTasks)
    if (newCompleted.has(index)) {
      newCompleted.delete(index)
    } else {
      newCompleted.add(index)
    }
    setCompletedTasks(newCompleted)
    onTaskComplete?.(index, !completedTasks.has(index))
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700/40 bg-slate-900/30 p-6 text-center">
        <p className="text-sm text-slate-400">No tasks available</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => {
        const isCompleted = completedTasks.has(index)
        const taskText = typeof task === 'string' ? task : task.title || task.description || String(task)

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group flex items-start gap-3 rounded-lg border px-4 py-3 transition-all cursor-pointer ${
              isCompleted
                ? 'border-cyan-400/30 bg-cyan-950/20 hover:bg-cyan-950/40'
                : 'border-slate-700/40 bg-slate-900/30 hover:border-cyan-400/20 hover:bg-slate-900/50'
            }`}
            onClick={() => handleTaskToggle(index)}
          >
            {/* Checkbox */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="mt-0.5 flex-shrink-0 pt-0.5"
            >
              {isCompleted ? (
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-cyan-400 to-blue-500"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                </div>
              ) : (
                <Square className="h-5 w-5 text-slate-500 group-hover:text-cyan-400" />
              )}
            </motion.div>

            {/* Task Text */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm transition-all ${
                  isCompleted
                    ? 'line-through text-slate-500'
                    : 'text-slate-200'
                }`}
              >
                {taskText}
              </p>
            </div>
          </motion.div>
        )
      })}

      {/* Completion Stats */}
      {tasks.length > 0 && (
        <div className="mt-4 rounded-lg border border-cyan-400/20 bg-cyan-950/20 p-3">
          <p className="text-xs text-cyan-300 font-medium">
            {completedTasks.size} of {tasks.length} tasks completed
          </p>
          <motion.div className="mt-2 h-1.5 rounded-full bg-slate-800/60 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-400"
              initial={{ width: 0 }}
              animate={{ width: `${(completedTasks.size / tasks.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
        </div>
      )}
    </div>
  )
}
