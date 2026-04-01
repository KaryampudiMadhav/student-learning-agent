import { useAppStore } from '../store/useAppStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    includeAuth = true,
    includeSession = true,
    signal,
  } = options

  const { token, sessionId, setSessionId, logout } = useAppStore.getState()

  const headers = {
    'Content-Type': 'application/json',
  }

  if (includeAuth && token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (includeSession && sessionId) {
    headers['x-session-id'] = sessionId
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  })

  const serverSession = response.headers.get('x-session-id')
  if (serverSession) {
    setSessionId(serverSession)
  }

  const payload = await parseResponse(response)

  if (!response.ok) {
    if (response.status === 401 && includeAuth) {
      logout()
    }

    const message = payload?.message || payload?.error || 'Request failed'
    throw new Error(message)
  }

  return payload
}

export const authApi = {
  register: (data) => apiRequest('/api/auth/register', { method: 'POST', body: data, includeAuth: false }),
  login: (data) => apiRequest('/api/auth/login', { method: 'POST', body: data, includeAuth: false }),
  forgotPassword: (data) => apiRequest('/api/auth/forgot', { method: 'POST', body: data, includeAuth: false }),
  resetPassword: (token, data) => apiRequest(`/api/auth/reset/${token}`, { method: 'POST', body: data, includeAuth: false }),
}

export const workflowApi = {
  run: (data) => apiRequest('/api/workflow/run', { method: 'POST', body: data }),
  progress: () => apiRequest('/api/workflow/progress'),
  logs: () => apiRequest('/api/workflow/logs'),
  history: () => apiRequest('/api/workflow/history'),
  reset: () => apiRequest('/api/workflow/reset', { method: 'POST', body: {} }),
  health: () => apiRequest('/api/workflow/health', { includeAuth: false }),
  submitAnswers: (data) => apiRequest('/api/workflow/run', { method: 'POST', body: data }),
}
