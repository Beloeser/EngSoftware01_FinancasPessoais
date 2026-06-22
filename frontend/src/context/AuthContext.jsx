import { createContext, useState } from 'react'
import api from '../services/api'

export const AuthContext = createContext(null)
const SESSION_STORAGE_KEYS = ['token', 'user']

function loadStoredUser() {
  const token = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')

  if (!token || !storedUser) return null

  try {
    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser)

  function persistSession(data) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    persistSession(data)
  }

  async function register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password })
    persistSession(data)
  }

  function logout() {
    SESSION_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
