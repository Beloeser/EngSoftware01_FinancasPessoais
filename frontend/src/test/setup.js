import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// O Node 25 expõe um `localStorage` global incompleto que ofusca o do jsdom.
// Instalamos uma implementação em memória simples para os testes.
class LocalStorageMock {
  constructor() {
    this.store = {}
  }
  clear() {
    this.store = {}
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null
  }
  setItem(key, value) {
    this.store[key] = String(value)
  }
  removeItem(key) {
    delete this.store[key]
  }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: new LocalStorageMock(),
  configurable: true,
  writable: true,
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.clearAllMocks()
})
