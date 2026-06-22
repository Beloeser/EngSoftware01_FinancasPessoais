import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useContext } from 'react'
import { ThemeContext, ThemeProvider } from './ThemeContext'

describe('ThemeContext', () => {
  const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>

  it('inicia com o tema "light"', () => {
    const { result } = renderHook(() => useContext(ThemeContext), { wrapper })
    expect(result.current.theme).toBe('light')
  })

  it('atualiza o tema com setTheme', () => {
    const { result } = renderHook(() => useContext(ThemeContext), { wrapper })
    act(() => result.current.setTheme('dark'))
    expect(result.current.theme).toBe('dark')
  })
})
