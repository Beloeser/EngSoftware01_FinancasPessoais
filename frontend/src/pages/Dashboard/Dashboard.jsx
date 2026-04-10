import { useState, useEffect } from 'react'
import api from '../../services/api'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import {
  Container,
  PageTitle,
  FormTitle,
  Input,
  Select,
  ErrorMessage,
  HistoryTitle,
  TransactionList,
  TransactionItem,
  TransactionDescription,
  TransactionMeta,
  TransactionAmount,
  TypeBadge,
  ActionButton,
} from './Styles'

const EMPTY_FORM = { description: '', amount: '', type: 'income', date: '' }

export default function Dashboard() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldError, setFieldError] = useState('')
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    const { data } = await api.get('/transactions')
    setTransactions(data)
  }

  async function handleDelete(id) {
    await api.delete(`/transactions/${id}`)
    fetchTransactions()
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFieldError('')

    if (!form.description || !form.amount || !form.date) {
      setFieldError('Preencha todos os campos obrigatórios.')
      return
    }

    await api.post('/transactions', {
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      date: form.date,
    })

    setForm(EMPTY_FORM)
    fetchTransactions()
  }

  function formatCurrency(value) {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <Container>
      <PageTitle>Minhas Finanças</PageTitle>

      <Card>
        <FormTitle>Nova Transação</FormTitle>
        <form onSubmit={handleSubmit}>
          <Input
            name="description"
            placeholder="Descrição *"
            value={form.description}
            onChange={handleChange}
          />
          <Input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Valor *"
            value={form.amount}
            onChange={handleChange}
          />
          <Select name="type" value={form.type} onChange={handleChange}>
            <option value="income">Entrada</option>
            <option value="expense">Saída</option>
          </Select>
          <Input
            name="date"
            type="date"
            placeholder="Data *"
            value={form.date}
            onChange={handleChange}
          />
          {fieldError && <ErrorMessage>{fieldError}</ErrorMessage>}
          <Button type="submit">Salvar</Button>
        </form>
      </Card>

      <HistoryTitle>Histórico</HistoryTitle>
      <TransactionList>
        {transactions.length === 0 && <p>Nenhuma transação registrada.</p>}
        {transactions.map((t) => (
          <TransactionItem key={t.id}>
            <div>
              <TransactionDescription>{t.description}</TransactionDescription>
              <TransactionMeta>
                {formatDate(t.date)} &middot;{' '}
                <TypeBadge $type={t.type}>
                  {t.type === 'income' ? 'Entrada' : 'Saída'}
                </TypeBadge>
              </TransactionMeta>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <TransactionAmount $type={t.type}>
                {t.type === 'expense' ? '- ' : '+ '}
                {formatCurrency(t.amount)}
              </TransactionAmount>
              <ActionButton type="button" onClick={() => handleDelete(t.id)}>
                Remover
              </ActionButton>
            </div>
          </TransactionItem>
        ))}
      </TransactionList>
    </Container>
  )
}
