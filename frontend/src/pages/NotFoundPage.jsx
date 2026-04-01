import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { GlassCard } from '../components/common/GlassCard'

export function NotFoundPage() {
  return (
    <PageContainer>
      <GlassCard>
        <h1 className="text-3xl font-semibold text-white">404</h1>
        <p className="mt-2 text-slate-300">The page you requested was not found.</p>
        <Link to="/dashboard" className="mt-4 inline-block rounded-lg border border-cyan-300/35 px-3 py-2 text-sm text-cyan-200">
          Return to dashboard
        </Link>
      </GlassCard>
    </PageContainer>
  )
}
