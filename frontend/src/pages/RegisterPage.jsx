import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authApi } from '../lib/api'
import { useAppStore } from '../store/useAppStore'
import { RippleButton } from '../components/common/RippleButton'
import { AuthSplitLayout } from '../components/layout/AuthSplitLayout'

void motion

export function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAppStore()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = await authApi.register(form)
      setAuth({ token: payload.token, user: payload.user })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthSplitLayout
      mode="register"
      loading={loading}
      identifier={form.email || form.name}
      passwordLength={form.password.length}
    >
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/70 p-6 backdrop-blur-xl"
      >
        <h1 className="mb-1 text-3xl font-semibold text-white">Create Account</h1>
        <p className="mb-5 text-sm text-slate-400">Start your personalized AI-powered learning journey.</p>

        <div className="space-y-4">
          <input
            required
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2.5 outline-none focus:border-cyan-300/50"
            placeholder="Full name"
          />
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2.5 outline-none focus:border-cyan-300/50"
            placeholder="Email"
          />
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
            className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2.5 outline-none focus:border-cyan-300/50"
            placeholder="Password"
          />
        </div>

        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

        <RippleButton type="submit" disabled={loading} className="mt-5 w-full justify-center">
          {loading ? 'Creating...' : 'Create Account'}
        </RippleButton>

        <p className="mt-4 text-sm text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-300 hover:text-cyan-200">
            Login
          </Link>
        </p>
      </motion.form>
    </AuthSplitLayout>
  )
}
