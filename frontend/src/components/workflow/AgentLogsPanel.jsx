import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { CheckCircle2, Loader2, Zap } from 'lucide-react'

const agentOrder = ['planner', 'resource', 'task', 'quiz_generation', 'evaluation', 'orchestrator', 'revision']
const agentLabels = {
  planner: 'Planner',
  resource: 'Resource Agent',
  task: 'Task Generator',
  quiz_generation: 'Quiz Creator',
  evaluation: 'Evaluator',
  orchestrator: 'Orchestrator',
  revision: 'Revision Agent',
  memory_before: 'Memory Load',
  memory_after: 'Memory Save',
}

export function AgentLogsPanel({ logs = [], isLoading = false }) {
  const scrollRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs])

  const sortedLogs = [...logs].sort((a, b) => {
    const aIndex = agentOrder.indexOf(a.agent)
    const bIndex = agentOrder.indexOf(b.agent)
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
  })

  return (
    <div className="flex h-full flex-col rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-cyan-950/40 p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3 border-b border-cyan-500/10 pb-4">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-500/20 blur-lg"></div>
          <Zap className="relative h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-cyan-300">AI Agent Workflow</h3>
          <p className="text-xs text-slate-400">Live execution trace</p>
        </div>
      </div>

      {/* Logs Container */}
      <div
        ref={containerRef}
        className="flex-1 space-y-3 overflow-y-auto scrollbar-thin scrollbar-track-slate-950/50 scrollbar-thumb-cyan-500/30 hover:scrollbar-thumb-cyan-500/50"
      >
        {sortedLogs.length === 0 && !isLoading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-500">Waiting for agents to start...</p>
          </div>
        ) : (
          <>
            {sortedLogs.map((log, index) => (
              <motion.div
                key={`${log.agent}-${index}`}
                initial={{ opacity: 0, x: -12, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group rounded-lg border border-cyan-400/10 bg-slate-900/40 p-3 hover:border-cyan-400/30 hover:bg-slate-900/60"
              >
                {/* Agent Header */}
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="absolute inset-0 h-2 w-2 animate-pulse rounded-full bg-cyan-400/40"></div>
                      <CheckCircle2 className="relative h-4 w-4 text-cyan-400" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                      {agentLabels[log.agent] || log.agent}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {/* Agent Output */}
                <div className="ml-6 overflow-hidden rounded bg-slate-950/60 p-2 text-xs text-slate-300">
                  <LogContent output={log.output} />
                </div>
              </motion.div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-slate-900/40 p-3"
              >
                <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                <span className="text-xs text-cyan-300">Processing...</span>
              </motion.div>
            )}

            <div ref={scrollRef} />
          </>
        )}
      </div>
    </div>
  )
}

function LogContent({ output }) {
  if (!output) return <span>No output</span>

  if (typeof output === 'string') {
    return <span className="line-clamp-3">{output}</span>
  }

  if (typeof output === 'object') {
    // Show key metrics
    if (output.score !== undefined) {
      return <span>Score: {output.score}%</span>
    }
    if (output.reason) {
      return <span className="line-clamp-2">{output.reason}</span>
    }
    if (output.action) {
      return <span>Action: {output.action}</span>
    }
    if (output.roadmap) {
      return <span>{output.roadmap.length} steps planned</span>
    }
    if (Array.isArray(output)) {
      return <span>{output.length} items</span>
    }

    return <span>{JSON.stringify(output).slice(0, 50)}...</span>
  }

  return <span>{String(output).slice(0, 50)}</span>
}
