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
      streak: 0,
      history: [],
      currentDay: 0,
      isWorkflowComplete: false,
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
          streak: 0,
          history: [],
          currentDay: 0,
          isWorkflowComplete: false,
        }),
      setSessionId: (sessionId) => set({ sessionId }),
      setProgress: (progress) => set({ progress }),
      setAgentLogs: (agentLogs) => set({ agentLogs }),
      addAgentLog: (log) =>
        set((state) => ({
          agentLogs: [...state.agentLogs, log],
        })),
      setWorkflow: (workflow) => set({ workflow }),
      setQuiz: (quiz) => set({ quiz }),
      setEvaluation: (evaluation) => set({ evaluation }),
      setCurrentGoal: (currentGoal) => set({ currentGoal }),
      setStreak: (streak) => set({ streak }),
      setHistory: (history) => set({ history }),
      addHistoryEntry: (entry) =>
        set((state) => ({
          history: [...state.history, entry],
        })),
      setCurrentDay: (currentDay) => set({ currentDay }),
      setIsWorkflowComplete: (isComplete) => set({ isWorkflowComplete: isComplete }),
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
        const streak = payload?.data?.streak || 0
        const day = payload?.data?.day || 0

        set({
          workflow: payload?.data || null,
          progress: memory || get().progress,
          evaluation: evaluation?.mode === 'evaluation' ? evaluation : get().evaluation,
          quiz,
          streak,
          currentDay: day,
          isWorkflowComplete: false,
          agentLogs: [],
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
        streak: state.streak,
        history: state.history,
        currentDay: state.currentDay,
      }),
    },
  ),
)
