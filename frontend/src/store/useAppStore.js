import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      sessionId: null,
      progress: null,
      agentLogs: [],
      workflow: null,
      quiz: [],
      evaluation: null,
      currentGoal: '',
      ui: {
        sidebarOpen: false,
      },
      setAuth: ({ token, user }) => set({ token, user }),
      logout: () =>
        set({
          token: null,
          user: null,
          progress: null,
          agentLogs: [],
          workflow: null,
          quiz: [],
          evaluation: null,
          currentGoal: '',
        }),
      setSessionId: (sessionId) => set({ sessionId }),
      setProgress: (progress) => set({ progress }),
      setAgentLogs: (agentLogs) => set({ agentLogs }),
      setWorkflow: (workflow) => set({ workflow }),
      setQuiz: (quiz) => set({ quiz }),
      setEvaluation: (evaluation) => set({ evaluation }),
      setCurrentGoal: (currentGoal) => set({ currentGoal }),
      toggleSidebar: () =>
        set((state) => ({
          ui: {
            ...state.ui,
            sidebarOpen: !state.ui.sidebarOpen,
          },
        })),
      closeSidebar: () =>
        set((state) => ({
          ui: {
            ...state.ui,
            sidebarOpen: false,
          },
        })),
      hydrateFromWorkflow: (payload) => {
        const memory = payload?.data?.memory
        const evaluation = payload?.data?.evaluation
        const quiz = payload?.data?.evaluation?.mode === 'quiz' ? payload.data.evaluation.questions || [] : []

        set({
          workflow: payload?.data || null,
          progress: memory || get().progress,
          evaluation: evaluation?.mode === 'evaluation' ? evaluation : get().evaluation,
          quiz,
        })
      },
    }),
    {
      name: 'agent-learning-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        sessionId: state.sessionId,
        progress: state.progress,
        currentGoal: state.currentGoal,
      }),
    },
  ),
)
