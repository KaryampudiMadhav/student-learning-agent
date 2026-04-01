import { motion } from 'framer-motion'
import { useState } from 'react'
import { Check, X } from 'lucide-react'

export function QuizSection({
  questions = [],
  onSubmit = null,
  evaluationResult = null,
  isLoading = false,
}) {
  const [answers, setAnswers] = useState({})

  const handleAnswerSelect = (qIndex, answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: answerIndex,
    }))
  }

  const handleSubmit = () => {
    if (Object.keys(answers).length === questions.length) {
      onSubmit?.(answers)
    }
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700/40 bg-slate-900/30 p-6 text-center">
        <p className="text-sm text-slate-400">No quiz available</p>
      </div>
    )
  }

  const progress = Object.keys(answers).length
  const isComplete = progress === questions.length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Assessment Quiz</h3>
        <span className="text-xs text-cyan-300 font-medium">
          {progress}/{questions.length}
        </span>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question, qIndex) => {
          const q = typeof question === 'string' ? { text: question, options: [] } : question
          const selectedAnswer = answers[qIndex]
          const isAnswered = selectedAnswer !== undefined

          return (
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIndex * 0.05 }}
              className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-4 hover:border-cyan-400/20"
            >
              {/* Question Text */}
              <h4 className="mb-3 text-sm font-semibold text-white">
                <span className="mr-2 text-cyan-400">{qIndex + 1}.</span>
                {q.text || q.question}
              </h4>

              {/* Options */}
              <div className="space-y-2">
                {(q.options || []).map((option, optIndex) => {
                  const isSelected = selectedAnswer === optIndex
                  const isCorrect = evaluationResult?.correctAnswers?.[qIndex] === optIndex

                  let borderClass = 'border-slate-700/40'
                  let bgClass = 'bg-slate-900/30 hover:bg-slate-900/50 hover:border-cyan-400/20'

                  if (isSelected) {
                    borderClass = isCorrect
                      ? 'border-green-400/50'
                      : 'border-rose-400/50'
                    bgClass = isCorrect
                      ? 'bg-green-950/30'
                      : 'bg-rose-950/30'
                  } else if (evaluationResult && isCorrect) {
                    borderClass = 'border-green-400/50'
                    bgClass = 'bg-green-950/20'
                  }

                  return (
                    <motion.button
                      key={optIndex}
                      onClick={() => !evaluationResult && handleAnswerSelect(qIndex, optIndex)}
                      disabled={!!evaluationResult}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (qIndex * 0.05) + (optIndex * 0.02) }}
                      className={`w-full text-left rounded-lg border px-3 py-2.5 text-sm transition-all ${borderClass} ${bgClass} disabled:cursor-default`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200">{option}</span>
                        {isSelected && !evaluationResult && (
                          <div className="h-3 w-3 rounded-full bg-cyan-400" />
                        )}
                        {isSelected && evaluationResult && isCorrect && (
                          <Check className="h-4 w-4 text-green-400" />
                        )}
                        {isSelected && evaluationResult && !isCorrect && (
                          <X className="h-4 w-4 text-rose-400" />
                        )}
                        {evaluationResult && isCorrect && !isSelected && (
                          <Check className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Evaluation Result */}
      {evaluationResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-950/40 to-blue-950/40 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-cyan-300">Evaluation Result</h4>
            <span className="text-lg font-bold text-cyan-400">{evaluationResult.score}%</span>
          </div>

          {evaluationResult.feedback && (
            <p className="text-xs text-slate-300 mb-3">{evaluationResult.feedback}</p>
          )}

          {evaluationResult.weakAreas && evaluationResult.weakAreas.length > 0 && (
            <div className="mt-3 border-t border-cyan-400/10 pt-3">
              <p className="text-xs font-medium text-orange-300 mb-2">Areas to improve:</p>
              <div className="flex flex-wrap gap-2">
                {evaluationResult.weakAreas.map((area, idx) => (
                  <span key={idx} className="rounded-full bg-orange-500/20 px-2 py-1 text-xs text-orange-300 border border-orange-500/30">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Submit Button */}
      {!evaluationResult && (
        <motion.button
          onClick={handleSubmit}
          disabled={!isComplete || isLoading}
          whileHover={isComplete ? { scale: 1.02 } : {}}
          whileTap={isComplete ? { scale: 0.98 } : {}}
          className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
            isComplete
              ? 'border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30'
              : 'border border-slate-700/40 bg-slate-900/30 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Evaluating...' : 'Submit Assessment'}
        </motion.button>
      )}
    </div>
  )
}
