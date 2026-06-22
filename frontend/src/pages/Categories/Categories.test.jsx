import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Categories from './Categories'

vi.mock('../../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), delete: vi.fn() },
}))

import api from '../../services/api'

describe('Categories (integração)', () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: [] })
    api.post.mockResolvedValue({ data: { id: 1, name: 'Lazer' } })
    api.delete.mockResolvedValue({ data: {} })
  })

  it('mostra o estado vazio quando não há categorias', async () => {
    render(<Categories />)
    expect(await screen.findByText('Nenhuma categoria cadastrada.')).toBeInTheDocument()
    expect(api.get).toHaveBeenCalledWith('/categories')
  })

  it('adiciona uma nova categoria e limpa o campo', async () => {
    render(<Categories />)
    const input = screen.getByPlaceholderText('Nome da categoria *')
    await userEvent.type(input, 'Lazer')
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar' }))

    expect(await screen.findByText('Lazer')).toBeInTheDocument()
    expect(api.post).toHaveBeenCalledWith('/categories', { name: 'Lazer' })
    expect(input).toHaveValue('')
  })

  it('exibe erro ao tentar adicionar categoria vazia', async () => {
    render(<Categories />)
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar' }))
    expect(screen.getByText('Informe o nome da categoria.')).toBeInTheDocument()
  })

  it('exibe erro ao tentar adicionar categoria duplicada', async () => {
    render(<Categories />)
    const input = screen.getByPlaceholderText('Nome da categoria *')
    await userEvent.type(input, 'Lazer')
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar' }))
    await userEvent.type(input, 'Lazer')
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar' }))

    expect(screen.getByText('Categoria já cadastrada.')).toBeInTheDocument()
  })

  it('remove uma categoria da lista', async () => {
    render(<Categories />)
    const input = screen.getByPlaceholderText('Nome da categoria *')
    await userEvent.type(input, 'Lazer')
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar' }))
    expect(await screen.findByText('Lazer')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Remover' }))
    expect(api.delete).toHaveBeenCalledWith('/categories/1')
    await waitFor(() => {
      expect(screen.queryByText('Lazer')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Nenhuma categoria cadastrada.')).toBeInTheDocument()
  })
})
