import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../../services/api', () => ({
  default: { get: vi.fn() },
}))

vi.mock('../../hooks/useCategories', () => ({
  useCategories: () => ({
    categories: [
      { id: 1, name: 'Trabalho' },
      { id: 2, name: 'Mercado' },
    ],
  }),
}))

vi.mock('react-chartjs-2', () => ({
  Pie: () => <div data-testid="pie-chart" />,
  Line: () => <div data-testid="line-chart" />,
}))

const mockSave = vi.fn()
vi.mock('jspdf', () => ({
  default: vi.fn(() => ({
    setFontSize: vi.fn(),
    text: vi.fn(),
    line: vi.fn(),
    addPage: vi.fn(),
    save: mockSave,
  })),
}))

import api from '../../services/api'
import VisaoGeral from './VisaoGeral'

const SAMPLE = [
  { id: 1, description: 'Salário', type: 'income', amount: 1000, date: '2024-01-05', categoryId: 1, category: { id: 1, name: 'Trabalho' } },
  { id: 2, description: 'Mercado', type: 'expense', amount: 400, date: '2024-01-06', categoryId: 2, category: { id: 2, name: 'Mercado' } },
]

describe('VisaoGeral (integração)', () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: [] })
  })

  it('exibe os totais (entradas, saídas e saldo) calculados', async () => {
    api.get.mockResolvedValue({ data: SAMPLE })
    render(<VisaoGeral />)
    expect(await screen.findByText(/1\.000,00/)).toBeInTheDocument()
    expect(screen.getByText(/400,00/)).toBeInTheDocument()
    expect(screen.getByText(/600,00/)).toBeInTheDocument()
  })

  it('renderiza os gráficos quando há transações', async () => {
    api.get.mockResolvedValue({ data: SAMPLE })
    render(<VisaoGeral />)
    expect(await screen.findByTestId('pie-chart')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })

  it('mostra mensagem de vazio e desabilita o PDF sem transações', async () => {
    api.get.mockResolvedValue({ data: [] })
    render(<VisaoGeral />)
    expect(
      await screen.findByText('Nenhuma transação encontrada para os filtros selecionados.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Exportar PDF' })).toBeDisabled()
  })

  it('filtra por mês e permite limpar os filtros', async () => {
    api.get.mockResolvedValue({ data: SAMPLE })
    const { container } = render(<VisaoGeral />)
    await screen.findByText(/1\.000,00/)

    const monthInput = container.querySelector('input[type="month"]')
    fireEvent.change(monthInput, { target: { value: '2099-12' } })

    expect(
      screen.getByText('Nenhuma transação encontrada para os filtros selecionados.'),
    ).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }))
    expect(screen.getByText(/1\.000,00/)).toBeInTheDocument()
  })

  it('gera o PDF ao clicar em "Exportar PDF"', async () => {
    api.get.mockResolvedValue({ data: SAMPLE })
    render(<VisaoGeral />)
    await screen.findByText(/1\.000,00/)

    await userEvent.click(screen.getByRole('button', { name: 'Exportar PDF' }))
    expect(mockSave).toHaveBeenCalledWith('transacoes.pdf')
  })

  it('aplica filtro por valor mínimo', async () => {
    api.get.mockResolvedValue({ data: SAMPLE })
    render(<VisaoGeral />)
    await screen.findByText(/1\.000,00/)

    await userEvent.type(screen.getByPlaceholderText('Valor mínimo'), '500')

    // A saída de 400 sai do filtro; sobra só a entrada de 1000.
    expect(screen.getByRole('button', { name: 'Limpar filtros' })).toBeInTheDocument()
    expect(screen.getAllByText(/1\.000,00/).length).toBeGreaterThan(0)
  })

  it('aplica filtro por categoria usando categoryId da transação', async () => {
    api.get.mockResolvedValue({ data: SAMPLE })
    render(<VisaoGeral />)
    await screen.findByText(/1\.000,00/)

    fireEvent.change(screen.getByDisplayValue('Todas as categorias'), { target: { value: '2' } })

    expect(screen.getAllByText(/400,00/).length).toBeGreaterThan(0)
    expect(screen.queryByText(/1\.000,00/)).not.toBeInTheDocument()
  })
})
