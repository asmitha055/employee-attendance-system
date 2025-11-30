import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  login: (payload) => {
    localStorage.setItem('token', payload.token)
    localStorage.setItem('user', JSON.stringify(payload.user))
    set({ token: payload.token, user: payload.user })
  },
  logout: () => {
    localStorage.removeItem('token'); localStorage.removeItem('user')
    set({ token: null, user: null })
  }
}))
