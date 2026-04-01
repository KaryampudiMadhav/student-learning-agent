import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, BrainCircuit, CalendarDays, Flame, Sparkles } from 'lucide-react'
import { GlassCard } from '../components/common/GlassCard'
import { MetricCard } from '../components/dashboard/MetricCard'
import { ThreeHero } from '../components/background/ThreeHero'
import { AnimatedCounter } from '../components/common/AnimatedCounter'
import { LoadingSkeleton } from '../components/common/LoadingSkeleton'
import { PageContainer } from '../components/layout/PageContainer'
import { workflowApi } from '../lib/api'
import { useAppStore } from '../store/useAppStore'

export function DashboardPage() {
  const { user, progress, sessionId, setProgress, setAgentLogs } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [progressPayload, logsPayload] = await Promise.all([
          workflowApi.progress(),
          workflowApi.logs(),
        ])
        setProgress(progressPayload || null)
        setAgentLogs(logsPayload || [])
      } catch {
        setProgress(null)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [setProgress, setAgentLogs])

  const scoreAverage = useMemo(() => {
    const scores = progress?.scores || []
    if (!scores.length) return 0
    return Math.round(scores.reduce((sum, item) => sum + (item.score || 0), 0) / scores.length)
  }, [progress])

  const progressPercent = Math.min(100, Math.max(0, scoreAverage))

  if (loading) {
    return (
      <PageContainer>
        <div className="grid gap-4 md:grid-cols-3">
          <LoadingSkeleton className="h-32" />
          <LoadingSkeleton className="h-32" />
          <LoadingSkeleton className="h-32" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <section className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <GlassCard className="p-6" hover={false}>
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.26em] text-cyan-300/80">AI Learning Orchestrator</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Welcome, {user?.name || 'Learner'}</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Your adaptive learning pipeline is active. Session-aware memory and agent orchestration are tracking your growth in real time.
            </p>
            <p className="mt-3 rounded-lg border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
              Session: {sessionId || 'Awaiting first API call'}
            </p>
          </div>
          <ThreeHero />
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current Mastery</p>
          <div className="mt-4 flex items-center justify-center">
            <div
              className="grid h-44 w-44 place-items-center rounded-full border border-white/15"
              style={{
                background: `conic-gradient(#22d3ee ${progressPercent}%, rgba(255,255,255,0.08) ${progressPercent}% 100%)`,
              }}
            >
              <div className="grid h-34 w-34 place-items-center rounded-full bg-slate-950/90">
                <div className="text-center">
                  <p className="text-3xl font-semibold text-white">
                    <AnimatedCounter value={progressPercent} suffix="%" />
                  </p>
                  <p className="text-xs text-slate-400">Average Score</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-amber-300/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
            <span className="flex items-center gap-2"><Flame className="h-4 w-4 animate-bounce" /> Streak</span>
            <strong>{progress?.streak || 0} days</strong>
          </div>
        </GlassCard>
      </section>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={BrainCircuit}
          title="Topics Learned"
          value={<AnimatedCounter value={progress?.scores?.length || 0} />}
          subtitle="Scored sessions"
          accent="from-cyan-400 to-blue-500"
        />
        <MetricCard
          icon={Activity}
          title="Current Status"
          value={progress?.status || 'learning'}
          subtitle="Adaptive state"
          accent="from-emerald-400 to-teal-500"
        />
        <MetricCard
          icon={CalendarDays}
          title="Skipped Days"
          value={<AnimatedCounter value={progress?.skippedDays || 0} />}
          subtitle="Consistency tracker"
          accent="from-orange-400 to-rose-500"
        />
        <MetricCard
          icon={Sparkles}
          title="Weak Areas"
          value={<AnimatedCounter value={progress?.weakAreas?.length || 0} />}
          subtitle="Revision targets"
          accent="from-violet-400 to-indigo-500"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h2 className="text-lg font-semibold text-white">Roadmap Snapshot</h2>
          <div className="mt-3 space-y-3">
            {(progress?.roadmap || []).map((item, idx) => (
              <div key={`${item.level}-${idx}`} className="rounded-xl border border-white/10 bg-slate-900/40 p-3">
                <p className="text-sm font-medium capitalize text-cyan-200">{item.level}</p>
                <p className="mt-1 text-sm text-slate-300">{(item.topics || []).join(' • ') || 'No topics yet'}</p>
              </div>
            ))}
            {!progress?.roadmap?.length ? <p className="text-sm text-slate-400">Run a workflow to generate your roadmap.</p> : null}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Link to="/workflow" className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-3 text-sm text-cyan-100 hover:bg-cyan-400/20">
              Start New Workflow
            </Link>
            <Link to="/quiz" className="rounded-xl border border-violet-300/25 bg-violet-400/10 p-3 text-sm text-violet-100 hover:bg-violet-400/20">
              Continue Quiz
            </Link>
            <Link to="/analytics" className="rounded-xl border border-emerald-300/25 bg-emerald-400/10 p-3 text-sm text-emerald-100 hover:bg-emerald-400/20">
              View Analytics
            </Link>
            <Link to="/agents" className="rounded-xl border border-amber-300/25 bg-amber-400/10 p-3 text-sm text-amber-100 hover:bg-amber-400/20">
              Agent Timeline
            </Link>
          </div>
        </GlassCard>
      </section>
    </PageContainer>
  )
}
