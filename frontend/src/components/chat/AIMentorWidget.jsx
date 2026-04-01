import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Brain, LifeBuoy, SendHorizontal, Sparkles, X } from 'lucide-react'
import { workflowApi } from '../../lib/api'
import { useAppStore } from '../../store/useAppStore'

void motion

const quickPrompts = [
  'Explain this topic in simple steps',
  'Give me real-world examples',
  'What am I doing wrong and how to fix it?',
  'Create a 30-minute revision plan',
]

function buildDoubtGoal(question, context) {
  const recentTurns = context.history
    .slice(-4)
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
    .join('\n')

  const weakAreas = (context.progress?.weakAreas || [])
    .map((item) => item.topic)
    .filter(Boolean)
    .join(', ')

  const scores = (context.progress?.scores || [])
    .slice(-5)
    .map((item) => item.score)
    .join(', ')

  return `
You are a high-quality doubt-solving learning assistant.

Student question: "${question}"

Student context:
- Active goal: ${context.currentGoal || 'Not set'}
- Current topic: ${context.progress?.currentTopic || context.workflow?.planner?.currentTopic || 'Unknown'}
- Difficulty: ${context.progress?.difficulty || 'beginner'}
- Weak areas: ${weakAreas || 'None'}
- Recent scores: ${scores || 'None'}

Recent conversation:
${recentTurns || 'No previous turns'}

Instructions:
1) Solve the user doubt clearly for their current level.
2) Add simple explanation + practical example + common mistakes.
3) Add a short action plan for next 20-30 minutes.
4) If useful, suggest one practice task and one resource type.
5) Keep tone supportive and confidence-building.
`
}

function extractMentorText(payload) {
  const data = payload?.data || {}
  const lines = ['Here is your doubt-focused guidance:']

  if (data.orchestrator?.reason) {
    lines.push(`\nUnderstanding:`)
    lines.push(data.orchestrator.reason)
  }

  if (data.task?.tasks?.length) {
    const focusedTasks = data.task.tasks.slice(0, 2)
    lines.push(`\nAction plan:`)
    focusedTasks.forEach((task, index) => {
      lines.push(`${index + 1}. ${task.title} (${task.estimatedTime || 'short'}) - ${task.expectedOutcome || 'Practice this concept.'}`)
    })
  }

  if (data.revision?.revision?.length) {
    const firstRevision = data.revision.revision[0]
    lines.push(`\nPriority fix:`)
    lines.push(`${firstRevision.topic}: ${firstRevision.action}`)
  }

  if (data.resource?.resources?.length) {
    const res = data.resource.resources[0]
    lines.push(`\nHelpful resource:`)
    lines.push(`${res.title} (${res.type})`)
  }

  return lines.join('\n') || 'Ask a doubt and I will break it down with examples, corrections, and a mini practice plan.'
}

export function AIMentorWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi, I am your Helping Assistant. Ask any doubt in any topic and I will explain it step-by-step.' },
  ])
  const { currentGoal, progress, workflow } = useAppStore()
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, typing])

  const placeholder = useMemo(() => {
    if (currentGoal) return `Ask a doubt about: ${currentGoal}`
    return 'Ask your doubt in any topic...'
  }, [currentGoal])

  const onSend = async (forcedPrompt) => {
    const question = (forcedPrompt || input).trim()
    if (!question || typing) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: question }])
    setTyping(true)

    try {
      const context = {
        currentGoal,
        progress,
        workflow,
        history: [...messages, { role: 'user', text: question }],
      }

      const payload = await workflowApi.run({
        goal: buildDoubtGoal(question, context),
      })

      const finalText = extractMentorText(payload)

      let visible = ''
      for (const char of finalText) {
        visible += char
        setMessages((prev) => {
          const withoutDraft = prev.filter((m) => !m.draft)
          return [...withoutDraft, { role: 'assistant', text: visible, draft: true }]
        })
        await new Promise((resolve) => setTimeout(resolve, 10))
      }

      setMessages((prev) => prev.map((m) => (m.draft ? { ...m, draft: false } : m)))
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', text: error.message || 'Unable to reach mentor right now.' }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-3 w-[min(92vw,380px)] rounded-2xl border border-cyan-300/35 bg-slate-950/85 p-3 shadow-[0_0_40px_rgba(34,211,238,0.25)] backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-cyan-200">
                <Sparkles className="h-4 w-4" /> Helping Assistant
              </div>
              <button onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onSend(prompt)}
                  className="rounded-full border border-cyan-300/25 bg-cyan-500/10 px-2.5 py-1 text-[11px] text-cyan-100 hover:bg-cyan-400/20"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div ref={listRef} className="mb-3 h-72 space-y-2 overflow-y-auto pr-1">
              {messages.map((message, idx) => (
                <div
                  key={`${message.role}-${idx}`}
                  className={`max-w-[88%] rounded-xl px-3 py-2 text-sm ${message.role === 'assistant' ? 'border border-cyan-300/20 bg-cyan-500/10 text-cyan-50' : 'ml-auto border border-white/15 bg-slate-800/70 text-slate-100'}`}
                >
                  {message.text}
                </div>
              ))}
              {typing && <div className="text-xs text-cyan-300">Mentor is thinking...</div>}
            </div>

            <div className="flex items-center gap-2">
              <input
                className="w-full rounded-xl border border-white/15 bg-slate-900/80 px-3 py-2 text-sm outline-none focus:border-cyan-300/50"
                value={input}
                placeholder={placeholder}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSend()
                }}
              />
              <button onClick={onSend} className="rounded-xl border border-cyan-300/40 bg-cyan-400/15 p-2 text-cyan-200">
                <SendHorizontal className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/50 bg-linear-to-br from-cyan-300 to-emerald-300 text-slate-950 shadow-[0_0_40px_rgba(16,185,129,0.45)]"
      >
        <div className="relative">
          <LifeBuoy className="h-6 w-6" />
          <Brain className="absolute -right-2 -top-2 h-3.5 w-3.5" />
        </div>
      </motion.button>
    </div>
  )
}
