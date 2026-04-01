import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar, Target } from 'lucide-react'
import { PageContainer } from '../components/layout/PageContainer'
import { useAppStore } from '../store/useAppStore'
import { workflowApi } from '../lib/api'
import { GlassCard } from '../components/common/GlassCard'
import { HistoryTimeline } from '../components/workflow/HistoryTimeline'

export function HistoryPage() {
  const { history, setHistory, streak } = useAppStore()
  const [stats, setStats] = useState({
    totalDays: 0,
    averageScore: 0,
    strongTopics: [],
    weakTopics: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await workflowApi.history()
        if (response?.data?.history) {
          setHistory(response.data.history)
        }

        // Calculate stats
        if (history && history.length > 0) {
          const scores = history.filter((h) => h.score).map((h) => h.score)
          const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : 0

          // Group by topic to find strong/weak areas
          const topicMap = {}
          history.forEach((h) => {
            if (!topicMap[h.topic]) {
              topicMap[h.topic] = []
            }
            if (h.score) {
              topicMap[h.topic].push(h.score)
            }
          })

          const topicStats = Object.entries(topicMap).map(([topic, scores]) => ({
            topic,
            avg: Math.round(scores.reduce((a, b) => a + b) / scores.length),
            count: scores.length,
          }))

          const strong = topicStats.filter((t) => t.avg >= 75).sort((a, b) => b.avg - a.avg)
          const weak = topicStats.filter((t) => t.avg < 75).sort((a, b) => a.avg - b.avg)

          setStats({
            totalDays: history.length,
            averageScore: avgScore,
            strongTopics: strong,
            weakTopics: weak,
          })
        }
      } catch (err) {
        console.error('Error fetching history:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  return (
    <PageContainer>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-cyan-400" />
          Your Learning Journey
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Track your progress and see how far you've come
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <GlassCard hover={true}>
          <div className="space-y-2">
            <p className="text-xs text-slate-400">Total Days</p>
            <p className="text-2xl font-bold text-cyan-300">{stats.totalDays}</p>
          </div>
        </GlassCard>

        <GlassCard hover={true}>
          <div className="space-y-2">
            <p className="text-xs text-slate-400">Average Score</p>
            <p className="text-2xl font-bold text-blue-300">{stats.averageScore}%</p>
          </div>
        </GlassCard>

        <GlassCard hover={true}>
          <div className="space-y-2">
            <p className="text-xs text-slate-400">Current Streak</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-orange-300">{streak}</span>
              <span className="text-lg">🔥</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={true}>
          <div className="space-y-2">
            <p className="text-xs text-slate-400">Topics Mastered</p>
            <p className="text-2xl font-bold text-green-300">{stats.strongTopics.length}</p>
          </div>
        </GlassCard>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Strong Topics */}
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700/40">
            <span className="text-green-400">✅</span>
            <h3 className="font-semibold text-white">Strong Topics</h3>
          </div>
          {stats.strongTopics.length > 0 ? (
            <div className="space-y-3">
              {stats.strongTopics.map((topic, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between rounded-lg bg-green-950/30 border border-green-400/30 px-3 py-2"
                >
                  <span className="text-sm text-green-200">{topic.topic}</span>
                  <span className="text-sm font-bold text-green-400">{topic.avg}%</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No mastered topics yet</p>
          )}
        </GlassCard>

        {/* Weak Topics */}
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700/40">
            <span className="text-orange-400">⚠️</span>
            <h3 className="font-semibold text-white">Needs Practice</h3>
          </div>
          {stats.weakTopics.length > 0 ? (
            <div className="space-y-3">
              {stats.weakTopics.map((topic, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between rounded-lg bg-orange-950/30 border border-orange-400/30 px-3 py-2"
                >
                  <span className="text-sm text-orange-200">{topic.topic}</span>
                  <span className="text-sm font-bold text-orange-400">{topic.avg}%</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No weak topics found</p>
          )}
        </GlassCard>
      </div>

      {/* Timeline */}
      <GlassCard hover={false}>
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/40">
          <Calendar className="h-4 w-4 text-cyan-400" />
          <h3 className="font-semibold text-white">Learning Timeline</h3>
        </div>
        <HistoryTimeline history={history} />
      </GlassCard>
    </PageContainer>
  )
}
