import { motion } from 'framer-motion'
import { Code2, Play, Terminal, UserRound } from 'lucide-react'
import { ParticlesBackground } from '../background/ParticlesBackground'

void motion

const tabByMode = {
  login: 'auth.login.js',
  register: 'user.create.js',
}

const actionByMode = {
  login: 'authentication',
  register: 'registration',
}

export function AuthSplitLayout({ children, mode, loading, identifier = '', passwordLength = 0 }) {
  const activeTab = tabByMode[mode] || tabByMode.login
  const actionName = actionByMode[mode] || actionByMode.login
  const maskedPassword = '*'.repeat(Math.max(passwordLength, 6))

  const logs = loading
    ? [
        `Initiating ${actionName} sequence...`,
        'Preparing secure payload...',
        'Calling AI learning backend...',
        'Awaiting server response...',
      ]
    : [
        `Switched context to ${activeTab}`,
        identifier ? `Draft updated for ${identifier}` : 'Ready for credentials input',
        "Awaiting 'Run Build' command...",
      ]

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-100">
      <ParticlesBackground />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(16,185,129,0.14),transparent_35%),linear-gradient(180deg,#020617_0%,#020617_44%,#030712_100%)]" />

      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 px-4 py-8 lg:grid-cols-[1fr_1.15fr] lg:gap-6 lg:px-8">
        <section className="flex items-center justify-center">{children}</section>

        <motion.aside
          initial={{ opacity: 0, x: 26 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative hidden rounded-3xl border border-cyan-300/15 bg-slate-950/55 p-5 shadow-[0_0_40px_rgba(14,165,233,0.16)] backdrop-blur-xl lg:flex lg:flex-col"
        >
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-xs tracking-[0.18em] text-cyan-200/90">
              <Code2 className="h-4 w-4" />
              IDE WINDOW
            </div>
            <div className="rounded-full border border-emerald-300/35 bg-emerald-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-200">
              {loading ? 'Live' : 'Ready'}
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2 text-xs text-slate-300">
            <span className="rounded-md border border-violet-300/45 bg-violet-400/10 px-2 py-1 text-violet-100">JS {activeTab}</span>
            <span className="rounded-md border border-white/15 px-2 py-1 text-slate-400">JS user.create.js</span>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden">
            <div className="rounded-2xl border border-white/10 bg-slate-950/65 p-4">
              <p className="mb-3 text-xs tracking-[0.18em] text-slate-400">LIVE COMPILATION</p>
              <pre className="overflow-x-auto text-sm leading-7 text-slate-200">
{`const credentials = {
  user: "${identifier || 'user_typing_here'}", // Live update
  token: "${maskedPassword}", // Obfuscated
}`}
              </pre>

              <button
                type="button"
                disabled
                className="mt-4 inline-flex cursor-default items-center gap-2 rounded-xl border border-emerald-400/55 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.25)]"
              >
                <Play className="h-4 w-4" />
                Run Build
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/75 p-4">
              <p className="mb-3 flex items-center gap-2 text-xs tracking-[0.18em] text-slate-400">
                <Terminal className="h-4 w-4" />
                TERMINAL
              </p>
              <div className="space-y-2 text-sm text-slate-300">
                {logs.map((line, index) => (
                  <p key={`${line}-${index}`} className="leading-relaxed">
                    <span className="mr-2 text-cyan-300">&gt;</span>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs tracking-[0.12em] text-slate-400">
            <UserRound className="h-4 w-4" />
            Context synced with form state
          </div>
        </motion.aside>
      </div>
    </div>
  )
}