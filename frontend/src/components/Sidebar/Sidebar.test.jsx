import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Sidebar from './Sidebar'

describe('Sidebar', () => {
  it('renderiza o rótulo da barra lateral', () => {
    render(<Sidebar />)
    expect(screen.getByText('Sidebar')).toBeInTheDocument()
  })
})
