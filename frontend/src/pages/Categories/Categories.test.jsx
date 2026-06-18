import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Categories from './Categories'

describe('Categories (integração)', () => {
  it('mostra o estado vazio quando não há categorias', () => {
    render(<Categories />)
    expect(screen.getByText('Nenhuma categoria cadastrada.')).toBeInTheDocument()
  })

  it('adiciona uma nova categoria e limpa o campo', async () => {
    render(<Categories />)
    const input = screen.getByPlaceholderText('Nome da categoria *')
    await userEvent.type(input, 'Lazer')
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar' }))

    expect(screen.getByText('Lazer')).toBeInTheDocument()
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
    expect(screen.getByText('Lazer')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Remover' }))
    expect(screen.queryByText('Lazer')).not.toBeInTheDocument()
    expect(screen.getByText('Nenhuma categoria cadastrada.')).toBeInTheDocument()
  })
})
