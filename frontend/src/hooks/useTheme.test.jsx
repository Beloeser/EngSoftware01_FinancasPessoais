import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { ThemeProvider } from '../context/ThemeContext'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  it('retorna o tema atual e o setter do ThemeProvider', () => {
    const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.theme).toBe('light')
    expect(typeof result.current.setTheme).toBe('function')
  })
})
