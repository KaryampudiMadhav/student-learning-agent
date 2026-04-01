import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, SendHorizontal, Sparkles, X } from 'lucide-react'
import { workflowApi } from '../../lib/api'
import { useAppStore } from '../../store/useAppStore'

void motion

function extractMentorText(payload) {
  const data = payload?.data || {}
  const lines = []

  if (data.planner?.reason) lines.push(`Plan focus: ${data.planner.reason}`)
  if (data.orchestrator?.reason) lines.push(`Decision: ${data.orchestrator.reason}`)
  if (data.task?.tasks?.length) lines.push(`Next task: ${data.task.tasks[0].title}`)
  if (data.resource?.resources?.length) lines.push(`Resource: ${data.resource.resources[0].title}`)

  return lines.join('\n\n') || 'I suggest you continue your workflow and attempt the quiz for deeper feedback.'
}

export function AIMentorWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Ask me anything about your learning path. I can guide your next best step.' },
  ])
  const { currentGoal } = useAppStore()
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, typing])

  const placeholder = useMemo(() => {
    if (currentGoal) return `Ask mentor about: ${currentGoal}`
    return 'Ask your AI mentor...'
  }, [currentGoal])

  const onSend = async () => {
    const question = input.trim()
    if (!question || typing) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: question }])
    setTyping(true)

    try {
      const payload = await workflowApi.run({ goal: question })
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
                <Sparkles className="h-4 w-4" /> AI Mentor
              </div>
              <button onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </button>
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
        className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/50 bg-linear-to-br from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.5)]"
      >
        <Bot className="h-6 w-6" />
      </motion.button>
    </div>
  )
}
