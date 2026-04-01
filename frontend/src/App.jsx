import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppLayout } from './components/layout/AppLayout'
import { useAppStore } from './store/useAppStore'
import { AgentsPage } from './pages/AgentsPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { DashboardPage } from './pages/DashboardPage'
import { EvaluationPage } from './pages/EvaluationPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { QuizPage } from './pages/QuizPage'
import { RegisterPage } from './pages/RegisterPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { WorkflowPage } from './pages/WorkflowPage'

function Protected({ children }) {
  const token = useAppStore((state) => state.token)
  if (!token) return <Navigate to="/login" replace />
  return <AppLayout>{children}</AppLayout>
}

function AuthOnly({ children }) {
  const token = useAppStore((state) => state.token)
  if (token) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<AuthOnly><LoginPage /></AuthOnly>} />
        <Route path="/register" element={<AuthOnly><RegisterPage /></AuthOnly>} />
        <Route path="/forgot-password" element={<AuthOnly><ForgotPasswordPage /></AuthOnly>} />
        <Route path="/reset-password/:token" element={<AuthOnly><ResetPasswordPage /></AuthOnly>} />

        <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
        <Route path="/workflow" element={<Protected><WorkflowPage /></Protected>} />
        <Route path="/quiz" element={<Protected><QuizPage /></Protected>} />
        <Route path="/evaluation" element={<Protected><EvaluationPage /></Protected>} />
        <Route path="/agents" element={<Protected><AgentsPage /></Protected>} />
        <Route path="/analytics" element={<Protected><AnalyticsPage /></Protected>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  )
}
