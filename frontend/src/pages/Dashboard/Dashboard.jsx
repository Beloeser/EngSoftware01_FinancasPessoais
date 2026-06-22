import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useCategories } from '../../hooks/useCategories'
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

const EMPTY_FORM = { description: '', amount: '', type: 'income', date: '', categoryId: '' }

export default function Dashboard() {
  const { categories } = useCategories()
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldError, setFieldError] = useState('')
  const [transactions, setTransactions] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [confirmingId, setConfirmingId] = useState(null)

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    const { data } = await api.get('/transactions')
    setTransactions(data)
  }

  async function handleDelete(id) {
    await api.delete(`/transactions/${id}`)
    setConfirmingId(null)
    fetchTransactions()
  }

  function handleEdit(t) {
    setEditingId(t.id)
    setForm({
      description: t.description,
      amount: String(t.amount),
      type: t.type,
      date: t.date,
      categoryId: t.categoryId ? String(t.categoryId) : '',
    })
    setFieldError('')
  }

  function handleCancelEdit() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFieldError('')
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

    const payload = {
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      date: form.date,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
    }

    if (editingId) {
      await api.put(`/transactions/${editingId}`, payload)
      setEditingId(null)
    } else {
      await api.post('/transactions', payload)
    }

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

  function getCategoryName(transaction) {
    if (transaction.category?.name) return transaction.category.name
    return categories.find((category) => category.id === transaction.categoryId)?.name
  }

  return (
    <Container>
      <PageTitle>Minhas Finanças</PageTitle>

      <Card>
        <FormTitle>{editingId ? 'Editar Transação' : 'Nova Transação'}</FormTitle>
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
          <Select name="categoryId" value={form.categoryId} onChange={handleChange}>
            <option value="">Categoria (opcional)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Select>
          {fieldError && <ErrorMessage>{fieldError}</ErrorMessage>}
          <Button type="submit">{editingId ? 'Atualizar' : 'Salvar'}</Button>
          {editingId && (
            <Button type="button" onClick={handleCancelEdit}>Cancelar</Button>
          )}
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
                {getCategoryName(t) && <> &middot; {getCategoryName(t)}</>}
              </TransactionMeta>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <TransactionAmount $type={t.type}>
                {t.type === 'expense' ? '- ' : '+ '}
                {formatCurrency(t.amount)}
              </TransactionAmount>
              <ActionButton type="button" data-action="edit" onClick={() => handleEdit(t)}>
                Editar
              </ActionButton>
              {confirmingId === t.id ? (
                <>
                  <ActionButton type="button" data-action="confirm" onClick={() => handleDelete(t.id)}>
                    Confirmar
                  </ActionButton>
                  <ActionButton type="button" onClick={() => setConfirmingId(null)}>
                    Cancelar
                  </ActionButton>
                </>
              ) : (
                <ActionButton type="button" onClick={() => setConfirmingId(t.id)}>
                  Remover
                </ActionButton>
              )}
            </div>
          </TransactionItem>
        ))}
      </TransactionList>
    </Container>
  )
}
