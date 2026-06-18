import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

import api from '../../services/api'
import Dashboard from './Dashboard'

describe('Dashboard (integração)', () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: [] })
    api.post.mockResolvedValue({ data: { id: 1 } })
    api.put.mockResolvedValue({ data: {} })
    api.delete.mockResolvedValue({ data: {} })
  })

  it('carrega as transações da API ao montar', async () => {
    api.get.mockResolvedValue({
      data: [{ id: 1, description: 'Aluguel', amount: 500, type: 'expense', date: '2024-02-01' }],
    })
    render(<Dashboard />)
    expect(await screen.findByText('Aluguel')).toBeInTheDocument()
    expect(api.get).toHaveBeenCalledWith('/transactions')
  })

  it('mostra mensagem quando não há transações', async () => {
    api.get.mockResolvedValue({ data: [] })
    render(<Dashboard />)
    expect(await screen.findByText('Nenhuma transação registrada.')).toBeInTheDocument()
  })

  it('cria uma nova transação ao enviar o formulário', async () => {
    api.get
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({
        data: [{ id: 99, description: 'Salário', amount: 1000, type: 'income', date: '2024-01-10' }],
      })
    render(<Dashboard />)
    await screen.findByText('Nenhuma transação registrada.')

    await userEvent.type(screen.getByPlaceholderText('Descrição *'), 'Salário')
    await userEvent.type(screen.getByPlaceholderText('Valor *'), '1000')
    fireEvent.change(screen.getByPlaceholderText('Data *'), { target: { value: '2024-01-10' } })
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(api.post).toHaveBeenCalledWith('/transactions', {
      description: 'Salário',
      amount: 1000,
      type: 'income',
      date: '2024-01-10',
    })
    expect(await screen.findByText('Salário')).toBeInTheDocument()
  })

  it('valida campos obrigatórios e não chama a API', async () => {
    api.get.mockResolvedValue({ data: [] })
    render(<Dashboard />)
    await screen.findByText('Nenhuma transação registrada.')

    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(screen.getByText('Preencha todos os campos obrigatórios.')).toBeInTheDocument()
    expect(api.post).not.toHaveBeenCalled()
  })

  it('remove uma transação após confirmação', async () => {
    api.get.mockResolvedValue({
      data: [{ id: 7, description: 'Conta de luz', amount: 200, type: 'expense', date: '2024-03-01' }],
    })
    render(<Dashboard />)
    await screen.findByText('Conta de luz')

    await userEvent.click(screen.getByRole('button', { name: 'Remover' }))
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    expect(api.delete).toHaveBeenCalledWith('/transactions/7')
  })

  it('edita uma transação existente', async () => {
    api.get.mockResolvedValue({
      data: [{ id: 5, description: 'Internet', amount: 100, type: 'expense', date: '2024-04-01' }],
    })
    render(<Dashboard />)
    await screen.findByText('Internet')

    await userEvent.click(screen.getByRole('button', { name: 'Editar' }))
    const descInput = screen.getByPlaceholderText('Descrição *')
    await userEvent.clear(descInput)
    await userEvent.type(descInput, 'Internet 500MB')
    await userEvent.click(screen.getByRole('button', { name: 'Atualizar' }))

    expect(api.put).toHaveBeenCalledWith(
      '/transactions/5',
      expect.objectContaining({ description: 'Internet 500MB', type: 'expense', date: '2024-04-01' }),
    )
  })
})
