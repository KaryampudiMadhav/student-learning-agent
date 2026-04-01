import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, ClipboardList, Goal, Sparkles } from 'lucide-react'
import { workflowApi } from '../lib/api'
import { useAppStore } from '../store/useAppStore'
import { GlassCard } from '../components/common/GlassCard'
import { RippleButton } from '../components/common/RippleButton'
import { PageContainer } from '../components/layout/PageContainer'

void motion

export function WorkflowPage() {
  const { hydrateFromWorkflow, setCurrentGoal, currentGoal, workflow } = useAppStore()
  const [goal, setGoal] = useState(currentGoal)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onRun = async () => {
    if (!goal.trim()) return
    setLoading(true)
    setError('')

    try {
      const payload = await workflowApi.run({ goal })
      setCurrentGoal(goal)
      hydrateFromWorkflow(payload)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const planner = workflow?.planner
  const resources = workflow?.resource?.resources || []
  const tasks = workflow?.task?.tasks || []

  return (
    <PageContainer>
      <div className="mb-5">
        <h1 className="text-3xl font-semibold text-white">Workflow Studio</h1>
        <p className="mt-1 text-sm text-slate-300">Generate plan, resources, tasks, and quiz in a single orchestrated run.</p>
      </div>

      <GlassCard className="mb-5" hover={false}>
        <label className="mb-2 block text-sm text-cyan-200">Learning Goal</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Example: Master Data Structures in JavaScript"
            className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2.5 outline-none focus:border-cyan-300/50"
          />
          <RippleButton onClick={onRun} disabled={loading} className="whitespace-nowrap">
            {loading ? 'Running Agents...' : 'Run Workflow'}
          </RippleButton>
        </div>
        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard>
          <div className="mb-3 flex items-center gap-2 text-cyan-200"><Goal className="h-4 w-4" /> Planner</div>
          <p className="text-sm text-slate-300">{planner?.reason || 'Run workflow to generate roadmap.'}</p>
          <div className="mt-3 space-y-2">
            {(planner?.roadmap || []).map((item, idx) => (
              <div key={`${item.level}-${idx}`} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300">
                <span className="font-medium capitalize text-white">{item.level}:</span> {(item.topics || []).join(', ')}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-3 flex items-center gap-2 text-cyan-200"><BookOpen className="h-4 w-4" /> Resources</div>
          <div className="space-y-2">
            {resources.slice(0, 4).map((item, idx) => (
              <a
                key={`${item.url}-${idx}`}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg border border-white/10 bg-slate-900/45 px-3 py-2 text-sm text-slate-200 hover:border-cyan-300/30"
              >
                <p className="font-medium text-white">{item.title}</p>
                <p className="text-xs text-slate-400">{item.type} • {item.difficulty}</p>
              </a>
            ))}
            {!resources.length ? <p className="text-sm text-slate-400">Resources will appear here.</p> : null}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-3 flex items-center gap-2 text-cyan-200"><ClipboardList className="h-4 w-4" /> Tasks</div>
          <div className="space-y-2">
            {tasks.slice(0, 4).map((task, idx) => (
              <motion.div
                key={`${task.title}-${idx}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-lg border border-white/10 bg-slate-900/45 px-3 py-2"
              >
                <p className="text-sm font-medium text-white">{task.title}</p>
                <p className="text-xs text-slate-400">{task.type} • {task.estimatedTime}</p>
              </motion.div>
            ))}
            {!tasks.length ? <p className="text-sm text-slate-400">Tasks will appear here.</p> : null}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-cyan-200"><Sparkles className="h-4 w-4" /> Quiz generated after workflow run</div>
        <Link to="/quiz" className="rounded-lg border border-cyan-300/35 bg-cyan-400/15 px-3 py-1.5 text-sm text-cyan-100 hover:bg-cyan-400/25">
          Open Quiz
        </Link>
      </GlassCard>
    </PageContainer>
  )
}
