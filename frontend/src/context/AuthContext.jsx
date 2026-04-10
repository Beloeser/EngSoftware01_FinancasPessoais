import { createContext, useState } from 'react'
import api from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    const stored = localStorage.getItem('user')
    if (token && stored) return JSON.parse(stored)
    return null
  })

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
