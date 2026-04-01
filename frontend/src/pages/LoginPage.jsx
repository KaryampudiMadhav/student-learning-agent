import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, TerminalSquare } from 'lucide-react'
import { authApi } from '../lib/api'
import { useAppStore } from '../store/useAppStore'
import { ParticlesBackground } from '../components/background/ParticlesBackground'

void motion

export function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { setAuth } = useAppStore()
  const [mode, setMode] = useState(location.pathname === '/register' ? 'register' : 'login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    identifier: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const onSwitchMode = (nextMode) => {
    setMode(nextMode)
    setError('')
    navigate(nextMode === 'login' ? '/login' : '/register')
  }

  const onChangeField = (field, value) => {
    setForm((state) => ({ ...state, [field]: value }))
  }

  const validate = () => {
    if (mode === 'login') {
      if (!form.identifier.trim()) return 'Username or email is required.'
      if (form.password.length < 6) return 'Password must be at least 6 characters.'
      return ''
    }

    if (!form.username.trim()) return 'Username is required.'
    if (!form.email.trim()) return 'Email is required.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Please enter a valid email address.'
    if (form.password.length < 6) return 'Password must be at least 6 characters.'
    if (form.confirmPassword !== form.password) return 'Confirm password does not match.'
    return ''
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError('')

    try {
      const payload = mode === 'login'
        ? await authApi.login({ email: form.identifier, password: form.password })
        : await authApi.register({ name: form.username, email: form.email, password: form.password })

      if (rememberMe && mode === 'login') {
        localStorage.setItem('remember_identifier', form.identifier)
      }

      setAuth({ token: payload.token, user: payload.user })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const maskedPassword = '\u2022'.repeat(Math.max(6, form.password.length || 0))
  const activeUser = mode === 'login' ? (form.identifier || 'username_or_email') : (form.username || form.email || 'new_user')
  const activeToken = mode === 'register' && form.confirmPassword && form.confirmPassword !== form.password
    ? 'token_mismatch'
    : maskedPassword

  const terminalLines = useMemo(() => {
    if (loading) {
      return mode === 'login'
        ? [
            'Authenticating credentials...',
            'Compiling secure session artifact...',
            'Negotiating encrypted gateway...',
          ]
        : [
            'Initiating registration sequence...',
            'Validating identity payload...',
            'Provisioning learner workspace...',
          ]
    }

    return mode === 'login'
      ? [
          'Awaiting Run Build command...',
          'Context bound to auth.login.js',
          'Runtime status: idle',
        ]
      : [
          'Awaiting Run Build command...',
          'Context bound to user.create.js',
          'Runtime status: idle',
        ]
  }, [loading, mode])

  return (
    <div className="auth-grid-overlay relative min-h-screen overflow-hidden text-slate-100">
      <ParticlesBackground />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.2),transparent_26%),radial-gradient(circle_at_85%_5%,rgba(16,185,129,0.16),transparent_35%),linear-gradient(180deg,#020617_0%,#020617_42%,#030712_100%)]" />

      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid w-full overflow-hidden rounded-3xl border border-cyan-300/25 bg-slate-950/70 shadow-[0_0_32px_rgba(34,211,238,0.14)] backdrop-blur-xl lg:grid-cols-[1fr_1.15fr]"
        >
        <section className="flex items-center justify-center border-b border-cyan-300/15 p-6 lg:border-b-0 lg:border-r md:p-8">
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl"
          >
            <div className="mb-6 rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-1">
              <div className="relative grid grid-cols-2 gap-1">
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                  className={`absolute bottom-0 top-0 w-1/2 rounded-xl bg-linear-to-r from-emerald-400/30 to-cyan-400/30 ${mode === 'login' ? 'left-0' : 'left-1/2'}`}
                />
                <button
                  type="button"
                  onClick={() => onSwitchMode('login')}
                  className={`relative z-10 rounded-xl px-4 py-2.5 text-sm font-medium transition ${mode === 'login' ? 'text-emerald-100' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchMode('register')}
                  className={`relative z-10 rounded-xl px-4 py-2.5 text-sm font-medium transition ${mode === 'register' ? 'text-cyan-100' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Register
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === 'login' ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === 'login' ? 10 : -10 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="mb-1 text-3xl font-semibold text-white">
                  {mode === 'login' ? 'Access Terminal' : 'Create New Identity'}
                </h1>
                <p className="mb-5 text-sm text-slate-400">
                  {mode === 'login'
                    ? 'Authenticate into your AI learning console.'
                    : 'Bootstrap your developer profile and start learning.'}
                </p>

                <div className="space-y-4">
                  {mode === 'register' ? (
                    <input
                      required
                      value={form.username}
                      onChange={(e) => onChangeField('username', e.target.value)}
                      className="auth-input w-full rounded-xl border border-white/20 bg-slate-950/70 px-3 py-2.5 outline-none"
                      placeholder="Username"
                    />
                  ) : null}

                  <input
                    required
                    type={mode === 'login' ? 'text' : 'email'}
                    value={mode === 'login' ? form.identifier : form.email}
                    onChange={(e) => onChangeField(mode === 'login' ? 'identifier' : 'email', e.target.value)}
                    className="auth-input w-full rounded-xl border border-white/20 bg-slate-950/70 px-3 py-2.5 outline-none"
                    placeholder={mode === 'login' ? 'Username / Email' : 'Email'}
                  />

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={(e) => onChangeField('password', e.target.value)}
                      className="auth-input w-full rounded-xl border border-white/20 bg-slate-950/70 px-3 py-2.5 pr-11 outline-none"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((state) => !state)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {mode === 'register' ? (
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={form.confirmPassword}
                        onChange={(e) => onChangeField('confirmPassword', e.target.value)}
                        className="auth-input w-full rounded-xl border border-white/20 bg-slate-950/70 px-3 py-2.5 pr-11 outline-none"
                        placeholder="Confirm Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((state) => !state)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-200"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  ) : null}
                </div>

                {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

                <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border border-cyan-300/30 bg-slate-900"
                    />
                    Remember Me
                  </label>
                  {mode === 'login' ? (
                    <Link to="/forgot-password" className="hover:text-cyan-300">Forgot Password?</Link>
                  ) : (
                    <span className="text-slate-500">Secure Enrollment Mode</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="auth-run-btn mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-300/55 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-200 transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Compiling...' : 'Start Learning'}
                </button>
              </motion.div>
            </AnimatePresence>
          </motion.form>
        </section>

        <motion.aside
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="flex min-h-[420px] flex-col p-5 md:p-6"
        >
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
            <p className="text-xs tracking-[0.2em] text-cyan-200">LIVE COMPILATION</p>
            <span className="rounded-full border border-emerald-300/40 bg-emerald-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-emerald-200">
              {loading ? 'Running' : 'Idle'}
            </span>
          </div>

          <div className="mb-4 rounded-2xl border border-white/10 bg-slate-950/80 p-4">
            <pre className="overflow-x-auto font-mono text-sm leading-7 text-slate-200">
{`import { Authenticator } from '@platform/security';

async function initSession() {
  const credentials = {
    user: '${activeUser}',
    token: '${activeToken}',
    mode: '${mode}'
  };

  return Authenticator.run(credentials);
}`}
            </pre>
          </div>

          <div className="flex-1 rounded-2xl border border-white/10 bg-slate-950/85 p-4">
            <p className="mb-3 flex items-center gap-2 text-xs tracking-[0.2em] text-slate-400">
              <TerminalSquare className="h-4 w-4" />
              TERMINAL
            </p>
            <div className="space-y-2 font-mono text-sm text-slate-300">
              {terminalLines.map((line) => (
                <p key={line}>
                  <span className="mr-2 text-cyan-300">&gt;</span>
                  {line}
                </p>
              ))}
              <p>
                <span className="mr-2 text-cyan-300">&gt;</span>
                <span className="auth-cursor">_</span>
              </p>
            </div>
          </div>
        </motion.aside>
        </motion.div>
      </div>
    </div>
  )
}
