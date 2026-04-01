import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { workflowApi } from '../lib/api'
import { useAppStore } from '../store/useAppStore'
import { GlassCard } from '../components/common/GlassCard'
import { RippleButton } from '../components/common/RippleButton'
import { PageContainer } from '../components/layout/PageContainer'

void motion

export function QuizPage() {
  const navigate = useNavigate()
  const {
    quiz,
    currentGoal,
    workflow,
    hydrateFromWorkflow,
    setEvaluation,
  } = useAppStore()

  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const progressPct = useMemo(() => {
    if (!quiz.length) return 0
    const selectedCount = Object.keys(answers).length
    return Math.round((selectedCount / quiz.length) * 100)
  }, [quiz.length, answers])

  const onSelect = (questionId, selectedIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedIndex }))
  }

  const onSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const mappedAnswers = quiz.map((item) => ({
        id: item.id,
        question: item.question,
        selectedIndex: answers[item.id],
        selectedOption: item.options?.[answers[item.id]] || '',
        correctIndex: item.correctIndex,
      }))

      const payload = await workflowApi.run({
        goal: currentGoal || workflow?.planner?.currentTopic || 'Continue learning workflow',
        answers: mappedAnswers,
      })

      hydrateFromWorkflow(payload)
      if (payload?.data?.evaluation) {
        setEvaluation(payload.data.evaluation)
      }
      navigate('/evaluation')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!quiz.length) {
    return (
      <PageContainer>
        <GlassCard>
          <h1 className="text-2xl font-semibold text-white">Quiz Not Ready</h1>
          <p className="mt-2 text-sm text-slate-300">Run workflow first to generate quiz questions.</p>
        </GlassCard>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="mb-4">
        <h1 className="text-3xl font-semibold text-white">Skill Check Quiz</h1>
        <p className="mt-1 text-sm text-slate-300">Pick the best option for each question to get adaptive evaluation.</p>
      </div>

      <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          className="h-full bg-linear-to-r from-cyan-400 to-blue-500"
        />
      </div>

      <div className="space-y-4">
        {quiz.map((item, idx) => (
          <GlassCard key={item.id || idx} hover={false}>
            <p className="text-sm text-cyan-200">Question {idx + 1}</p>
            <h3 className="mt-1 text-lg font-medium text-white">{item.question}</h3>
            <div className="mt-4 grid gap-2">
              {(item.options || []).map((option, optionIdx) => {
                const selected = answers[item.id] === optionIdx
                return (
                  <button
                    key={`${option}-${optionIdx}`}
                    onClick={() => onSelect(item.id, optionIdx)}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${selected ? 'border-cyan-300/60 bg-cyan-400/15 text-cyan-50' : 'border-white/10 bg-slate-900/40 text-slate-200 hover:border-cyan-300/35 hover:bg-cyan-500/10'}`}
                  >
                    <span>{option}</span>
                    {selected ? <CheckCircle2 className="h-4 w-4" /> : null}
                  </button>
                )
              })}
            </div>
          </GlassCard>
        ))}
      </div>

      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

      <div className="mt-6">
        <RippleButton onClick={onSubmit} disabled={loading || Object.keys(answers).length < quiz.length}>
          {loading ? 'Evaluating...' : 'Submit Quiz'}
        </RippleButton>
      </div>
    </PageContainer>
  )
}
