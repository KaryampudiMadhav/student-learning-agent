import { useMemo } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { AnimatedCounter } from '../components/common/AnimatedCounter'
import { GlassCard } from '../components/common/GlassCard'
import { PageContainer } from '../components/layout/PageContainer'
import { useAppStore } from '../store/useAppStore'

export function EvaluationPage() {
  const { evaluation, progress } = useAppStore()

  const score = evaluation?.score || 0
  const weakAreas = useMemo(
    () => evaluation?.weakAreas || progress?.weakAreas?.map((w) => w.topic) || [],
    [evaluation?.weakAreas, progress?.weakAreas],
  )

  const radarData = useMemo(() => {
    const strengths = evaluation?.strengths || []
    const weak = weakAreas || []
    return [
      ...strengths.slice(0, 3).map((item) => ({ topic: item, value: 85 })),
      ...weak.slice(0, 3).map((item) => ({ topic: item, value: 45 })),
    ]
  }, [evaluation, weakAreas])

  return (
    <PageContainer>
      <div className="mb-5">
        <h1 className="text-3xl font-semibold text-white">Evaluation Insights</h1>
        <p className="mt-1 text-sm text-slate-300">Performance breakdown and personalized improvement path.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <GlassCard className="grid place-items-center" hover={false}>
          <div
            className="grid h-52 w-52 place-items-center rounded-full border border-white/15"
            style={{
              background: `conic-gradient(#14b8a6 ${score}%, rgba(255,255,255,0.08) ${score}% 100%)`,
            }}
          >
            <div className="grid h-40 w-40 place-items-center rounded-full bg-slate-950/90 text-center">
              <p className="text-4xl font-semibold text-white"><AnimatedCounter value={score} suffix="%" /></p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Overall Score</p>
            </div>
          </div>
          <p className="mt-3 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
            {evaluation?.performanceLevel || progress?.status || 'learning'}
          </p>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-3 text-lg font-semibold text-white">Competency Radar</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="rgba(255,255,255,0.15)" />
                <PolarAngleAxis dataKey="topic" stroke="#a5b4fc" fontSize={12} />
                <Radar dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h3 className="mb-2 text-lg font-medium text-white">Weak Areas</h3>
          <div className="flex flex-wrap gap-2">
            {weakAreas.length ? weakAreas.map((topic) => (
              <span key={topic} className="rounded-full border border-rose-300/35 bg-rose-500/10 px-3 py-1 text-xs text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                {topic}
              </span>
            )) : <p className="text-sm text-slate-400">No weak areas identified yet.</p>}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-2 text-lg font-medium text-white">Improvement Plan</h3>
          <ul className="space-y-2 text-sm text-slate-200">
            {(evaluation?.improvementPlan || []).map((item, idx) => (
              <li key={`${item}-${idx}`} className="rounded-lg border border-white/10 bg-slate-900/45 px-3 py-2">{item}</li>
            ))}
            {!evaluation?.improvementPlan?.length ? <li className="text-slate-400">Complete a quiz to generate an improvement plan.</li> : null}
          </ul>
        </GlassCard>
      </div>
    </PageContainer>
  )
}
