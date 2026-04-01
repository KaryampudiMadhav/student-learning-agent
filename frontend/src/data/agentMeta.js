import {
  Brain,
  ClipboardCheck,
  Compass,
  Database,
  Lightbulb,
  Orbit,
  Repeat,
  Rocket,
} from 'lucide-react'

export const agentMeta = {
  planner: { label: 'Planner Agent', icon: Compass, color: 'from-cyan-400 to-blue-500' },
  resource: { label: 'Resource Agent', icon: Lightbulb, color: 'from-emerald-400 to-teal-500' },
  task: { label: 'Task Agent', icon: ClipboardCheck, color: 'from-orange-400 to-rose-500' },
  quiz_generation: { label: 'Quiz Evaluator', icon: Brain, color: 'from-fuchsia-400 to-violet-500' },
  evaluation: { label: 'Evaluation Agent', icon: Brain, color: 'from-violet-400 to-indigo-500' },
  orchestrator: { label: 'Orchestrator', icon: Orbit, color: 'from-sky-400 to-cyan-500' },
  revision: { label: 'Revision Agent', icon: Repeat, color: 'from-amber-400 to-orange-500' },
  memory_before: { label: 'Memory Snapshot (Before)', icon: Database, color: 'from-slate-400 to-slate-500' },
  memory_after: { label: 'Memory Snapshot (After)', icon: Rocket, color: 'from-lime-400 to-emerald-500' },
}
