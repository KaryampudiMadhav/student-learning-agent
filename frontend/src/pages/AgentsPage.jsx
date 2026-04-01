import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { workflowApi } from '../lib/api'
import { useAppStore } from '../store/useAppStore'
import { agentMeta } from '../data/agentMeta'
import { GlassCard } from '../components/common/GlassCard'
import { PageContainer } from '../components/layout/PageContainer'

void motion

export function AgentsPage() {
  const { agentLogs, setAgentLogs } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const payload = await workflowApi.logs()
        setAgentLogs(payload || [])
      } finally {
        setLoading(false)
      }
    }

    loadLogs()
  }, [setAgentLogs])

  return (
    <PageContainer>
      <div className="mb-5">
        <h1 className="text-3xl font-semibold text-white">Agent Timeline</h1>
        <p className="mt-1 text-sm text-slate-300">Live trace of every decision in your workflow orchestration.</p>
      </div>

      <div className="space-y-3">
        {loading ? <GlassCard>Loading timeline...</GlassCard> : null}
        {!loading && !agentLogs.length ? <GlassCard>No agent logs yet. Run workflow to populate timeline.</GlassCard> : null}

        {agentLogs.map((log, idx) => {
          const meta = agentMeta[log.agent] || {
            label: log.agent,
            icon: agentMeta.planner.icon,
            color: 'from-slate-400 to-slate-600',
          }
          const Icon = meta.icon

          return (
            <motion.div
              key={`${log.agent}-${idx}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <GlassCard className="relative" hover={false}>
                <span className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-linear-to-b ${meta.color}`} />
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-cyan-200" />
                  <p className="text-sm font-medium text-white">{meta.label}</p>
                  <span className="rounded-full border border-cyan-300/25 bg-cyan-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-cyan-200">
                    {log.agent}
                  </span>
                </div>
                <p className="mb-2 text-xs text-slate-400">{new Date(log.timestamp).toLocaleString()}</p>
                <pre className="max-h-64 overflow-auto rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs text-slate-300">
                  {JSON.stringify(log.output, null, 2)}
                </pre>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </PageContainer>
  )
}
