import { describe, it, expect, beforeEach } from 'vitest'
import api from './api'

describe('api (instância axios)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('usa a baseURL padrão quando VITE_API_URL não está definida', () => {
    expect(api.defaults.baseURL).toBe('http://localhost:5000/api')
  })

  describe('interceptor de request', () => {
    const runInterceptor = (config) =>
      api.interceptors.request.handlers[0].fulfilled(config)

    it('adiciona o header Authorization quando há token no localStorage', () => {
      localStorage.setItem('token', 'abc123')
      const config = runInterceptor({ headers: {} })
      expect(config.headers.Authorization).toBe('Bearer abc123')
    })

    it('não adiciona Authorization quando não há token', () => {
      const config = runInterceptor({ headers: {} })
      expect(config.headers.Authorization).toBeUndefined()
    })
  })
})
