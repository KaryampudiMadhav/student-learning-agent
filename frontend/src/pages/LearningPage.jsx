import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Play } from 'lucide-react'
import { PageContainer } from '../components/layout/PageContainer'
import { useAppStore } from '../store/useAppStore'
import { workflowApi } from '../lib/api'
import { GlassCard } from '../components/common/GlassCard'
import { RippleButton } from '../components/common/RippleButton'
import { AgentLogsPanel } from '../components/workflow/AgentLogsPanel'
import { StreakBadge } from '../components/workflow/StreakBadge'
import { ProgressBar } from '../components/workflow/ProgressBar'
import { TaskChecklist } from '../components/workflow/TaskChecklist'
import { QuizSection } from '../components/workflow/QuizSection'
import { HistoryTimeline } from '../components/workflow/HistoryTimeline'

export function LearningPage() {
  const navigate = useNavigate()
  const {
    workflow,
    agentLogs,
    addAgentLog,
    setAgentLogs,
    quiz,
    evaluation,
    setQuiz,
    setEvaluation,
    setWorkflow,
    streak,
    setStreak,
    history,
    setHistory,
    setCurrentDay,
    setIsWorkflowComplete,
    isWorkflowComplete,
    currentDay,
  } = useAppStore()

  const [isLoading, setIsLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('current') // 'current', 'history'
  const [showResults, setShowResults] = useState(false)

  const topic = workflow?.topic || 'Ready to learn'
  const tasks = workflow?.task?.tasks || []
  const resources = workflow?.resource?.resources || []

  // Simulate real-time agent logs (in production, you'd use WebSocket)
  const simulateAgentLogs = async () => {
    setAgentLogs([])
    const agentSteps = [
      { agent: 'memory_before', output: { currentTopic: topic } },
      { agent: 'planner', output: { reason: 'Planning learning path...' } },
      { agent: 'resource', output: { resources: resources.length } },
      { agent: 'task', output: { tasks: tasks.length } },
      { agent: 'quiz_generation', output: { questions: quiz.length } },
    ]

    for (const step of agentSteps) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      addAgentLog({
        agent: step.agent,
        output: step.output,
        timestamp: new Date(),
      })
    }

    // Add evaluation/orchestrator if already evaluated
    if (evaluation) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      addAgentLog({
        agent: 'orchestrator',
        output: { decision: evaluation.nextAction || 'Continue learning' },
        timestamp: new Date(),
      })
    }

    setIsWorkflowComplete(true)
  }

  useEffect(() => {
    if (workflow && agentLogs.length === 0) {
      simulateAgentLogs()
    }
  }, [workflow])

  const handleSubmitQuiz = async (answers) => {
    setSubmitting(true)
    try {
      const payload = await workflowApi.submitAnswers({
        answers: Object.values(answers),
      })

      const evalData = payload?.data?.evaluation
      setEvaluation(evalData)
      setShowResults(true)

      // Update streak if completed successfully
      if (evalData?.score >= 60) {
        const newStreak = (streak || 0) + 1
        setStreak(newStreak)

        // Add to history
        const newHistoryEntry = {
          day: currentDay + 1,
          topic,
          score: evalData.score,
          status: evalData.score >= 75 ? 'completed' : 'repeat',
          date: new Date(),
        }
        setHistory([...history, newHistoryEntry])
        setCurrentDay(currentDay + 1)
      }
    } catch (err) {
      console.error('Error submitting quiz:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNewWorkflow = () => {
    setWorkflow(null)
    setAgentLogs([])
    setQuiz([])
    setEvaluation(null)
    setShowResults(false)
    navigate('/workflow')
  }

  if (!workflow) {
    return (
      <PageContainer>
        <div className="flex h-96 items-center justify-center">
          <GlassCard className="max-w-md">
            <div className="text-center space-y-4">
              <BookOpen className="mx-auto h-12 w-12 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Start Learning</h2>
              <p className="text-sm text-slate-300">
                Begin your personalized learning journey with AI-powered guidance.
              </p>
              <RippleButton onClick={() => navigate('/workflow')} className="w-full">
                Begin Workflow
              </RippleButton>
            </div>
          </GlassCard>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">
            Day {currentDay + 1} — {topic}
          </h1>
          <p className="mt-2 text-sm text-slate-400">Continue your learning journey</p>
        </div>
        <StreakBadge streak={streak} animate={true} />
      </motion.div>

      {/* Tab navigation */}
      <div className="mb-6 flex gap-3 border-b border-slate-700/40">
        <motion.button
          onClick={() => setActiveTab('current')}
          className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'current'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
          whileHover={{ translateY: -2 }}
        >
          Today's Learning
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'history'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
          whileHover={{ translateY: -2 }}
        >
          Learning History
        </motion.button>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {activeTab === 'current' ? (
          // SPLIT LAYOUT: Left side + Right side
          <div className="grid gap-6 lg:grid-cols-3">
            {/* LEFT SIDE - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Bar */}
              <GlassCard hover={false}>
                <ProgressBar
                  current={currentDay}
                  total={30}
                  topic={topic}
                />
              </GlassCard>

              {/* Tasks Section */}
              {!showResults && (
                <GlassCard hover={false}>
                  <div className="mb-4 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-cyan-400" />
                    <h3 className="text-sm font-semibold text-white">Today's Tasks</h3>
                  </div>
                  <TaskChecklist tasks={tasks} />
                </GlassCard>
              )}

              {/* Quiz/Assessment Section */}
              {!showResults ? (
                <GlassCard hover={false}>
                  <QuizSection
                    questions={quiz}
                    onSubmit={handleSubmitQuiz}
                    isLoading={submitting}
                  />
                </GlassCard>
              ) : (
                // Results Display
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <GlassCard hover={false}>
                    <div className="text-center space-y-4">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-400/50">
                        <span className="text-2xl font-bold text-cyan-300">
                          {evaluation?.score || 0}%
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Great work!</h3>
                        <p className="mt-1 text-sm text-slate-300">
                          {evaluation?.feedback || 'Keep practicing to improve'}
                        </p>
                      </div>
                      {evaluation?.score >= 75 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="inline-block rounded-full bg-green-500/20 border border-green-400/50 px-4 py-2"
                        >
                          <p className="text-sm font-semibold text-green-300">✅ Day Completed!</p>
                        </motion.div>
                      )}
                    </div>
                  </GlassCard>

                  <GlassCard hover={false}>
                    <RippleButton onClick={handleNewWorkflow} className="w-full flex items-center justify-center gap-2">
                      <Play className="h-4 w-4" />
                      Start Next Day
                    </RippleButton>
                  </GlassCard>
                </motion.div>
              )}
            </div>

            {/* RIGHT SIDE - Agent Logs Panel */}
            <div className="force-visible lg:col-span-1">
              <AgentLogsPanel
                logs={agentLogs}
                isLoading={isLoading || !isWorkflowComplete}
              />
            </div>
          </div>
        ) : (
          // HISTORY TAB
          <GlassCard hover={false}>
            <HistoryTimeline history={history} />
          </GlassCard>
        )}
      </motion.div>
    </PageContainer>
  )
}
