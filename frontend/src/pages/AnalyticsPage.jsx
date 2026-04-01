import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { GlassCard } from '../components/common/GlassCard'
import { PageContainer } from '../components/layout/PageContainer'
import { useAppStore } from '../store/useAppStore'

export function AnalyticsPage() {
  const { progress } = useAppStore()

  const scoreData = useMemo(
    () => (progress?.scores || []).map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      score: item.score,
    })),
    [progress],
  )

  const weakAreaData = useMemo(
    () => (progress?.weakAreas || []).map((item) => ({ name: item.topic, value: item.count || 1 })),
    [progress],
  )

  return (
    <PageContainer>
      <div className="mb-5">
        <h1 className="text-3xl font-semibold text-white">Learning Analytics</h1>
        <p className="mt-1 text-sm text-slate-300">Animated trends, weak-area load, and consistency pattern.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h2 className="mb-3 text-lg font-semibold text-white">Score Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreData}>
                <defs>
                  <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.75} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#cbd5e1" fontSize={11} />
                <YAxis stroke="#cbd5e1" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(148,163,184,0.25)' }} />
                <Area type="monotone" dataKey="score" stroke="#22d3ee" fill="url(#scoreGlow)" strokeWidth={2.5} isAnimationActive />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-3 text-lg font-semibold text-white">Weak Areas Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={weakAreaData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  fill="#0ea5e9"
                  isAnimationActive
                  label
                />
                <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(148,163,184,0.25)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </PageContainer>
  )
}
