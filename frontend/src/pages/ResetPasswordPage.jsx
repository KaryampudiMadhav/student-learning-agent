import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authApi } from '../lib/api'
import { RippleButton } from '../components/common/RippleButton'

void motion

export function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await authApi.resetPassword(token, { password })
      navigate('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/70 p-6 backdrop-blur-xl"
      >
        <h1 className="mb-1 text-3xl font-semibold text-white">Set New Password</h1>
        <p className="mb-5 text-sm text-slate-400">Create a strong password and continue.</p>

        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2.5 outline-none focus:border-cyan-300/50"
          placeholder="New password"
        />

        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

        <RippleButton type="submit" disabled={loading} className="mt-5 w-full justify-center">
          {loading ? 'Updating...' : 'Update Password'}
        </RippleButton>

        <p className="mt-4 text-sm text-slate-300">
          <Link to="/login" className="hover:text-cyan-300">Back to login</Link>
        </p>
      </motion.form>
    </div>
  )
}
