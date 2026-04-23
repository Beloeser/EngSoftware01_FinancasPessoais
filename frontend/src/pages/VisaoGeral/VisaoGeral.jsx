import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js'
import { Pie, Line } from 'react-chartjs-2'
import jsPDF from 'jspdf'
import api from '../../services/api'
import { useCategories } from '../../hooks/useCategories'
import {
  Container,
  PageTitle,
  FiltersRow,
  FilterSelect,
  FilterInput,
  ClearButton,
  CardsRow,
  SummaryCard,
  CardLabel,
  CardValue,
  ChartSection,
  ChartTitle,
  ChartsRow,
  ExportButton,
  EmptyMessage,
} from './Styles'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement)

const CAT_MAP_KEY = 'transactionCategories'
const PIE_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF']

function loadCatMap() {
  try {
    return JSON.parse(localStorage.getItem(CAT_MAP_KEY)) || {}
  } catch {
    return {}
  }
}

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function VisaoGeral() {
  const { categories } = useCategories()
  const [transactions, setTransactions] = useState([])
  const [filterMonth, setFilterMonth] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const catMap = loadCatMap()

  useEffect(() => {
    api.get('/transactions').then(({ data }) => setTransactions(data))
  }, [])

  const filtered = transactions.filter((t) => {
    if (filterMonth && !t.date.startsWith(filterMonth)) return false
    if (filterCategory && (catMap[t.id] || '') !== filterCategory) return false
    return true
  })

  const totalIncome = filtered
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = filtered
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpense

  const expensesByCategory = {}
  filtered
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const cat = catMap[t.id] || 'Sem categoria'
      expensesByCategory[cat] = (expensesByCategory[cat] || 0) + Number(t.amount)
    })

  const pieData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: PIE_COLORS,
      },
    ],
  }

  const monthTotals = {}
  transactions.forEach((t) => {
    const month = t.date.substring(0, 7)
    if (!monthTotals[month]) monthTotals[month] = { income: 0, expense: 0 }
    monthTotals[month][t.type] += Number(t.amount)
  })
  const sortedMonths = Object.keys(monthTotals).sort()

  const lineData = {
    labels: sortedMonths,
    datasets: [
      {
        label: 'Entradas',
        data: sortedMonths.map((m) => monthTotals[m].income),
        borderColor: '#27ae60',
        backgroundColor: 'rgba(39,174,96,0.1)',
        tension: 0.3,
      },
      {
        label: 'Saídas',
        data: sortedMonths.map((m) => monthTotals[m].expense),
        borderColor: '#c0392b',
        backgroundColor: 'rgba(192,57,43,0.1)',
        tension: 0.3,
      },
    ],
  }

  function exportPDF() {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Relatório de Transações', 14, 20)
    doc.setFontSize(10)
    doc.text(`Entradas: ${formatCurrency(totalIncome)}`, 14, 30)
    doc.text(`Saídas: ${formatCurrency(totalExpense)}`, 14, 37)
    doc.text(`Saldo: ${formatCurrency(balance)}`, 14, 44)

    let y = 58
    doc.setFontSize(9)
    doc.text('Descrição', 14, y)
    doc.text('Tipo', 80, y)
    doc.text('Categoria', 110, y)
    doc.text('Data', 155, y)
    doc.text('Valor', 178, y)
    y += 5
    doc.line(14, y, 200, y)
    y += 5

    filtered.forEach((t) => {
      if (y > 280) {
        doc.addPage()
        y = 20
      }
      doc.text(t.description.substring(0, 30), 14, y)
      doc.text(t.type === 'income' ? 'Entrada' : 'Saída', 80, y)
      doc.text((catMap[t.id] || '-').substring(0, 20), 110, y)
      doc.text(t.date, 155, y)
      doc.text(Number(t.amount).toFixed(2), 178, y)
      y += 7
    })

    doc.save('transacoes.pdf')
  }

  function clearFilters() {
    setFilterMonth('')
    setFilterCategory('')
  }

  const hasFilters = filterMonth || filterCategory

  return (
    <Container>
      <PageTitle>Visão Geral</PageTitle>

      <FiltersRow>
        <FilterInput
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        />
        <FilterSelect
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </FilterSelect>
        {hasFilters && <ClearButton type="button" onClick={clearFilters}>Limpar filtros</ClearButton>}
      </FiltersRow>

      <CardsRow>
        <SummaryCard>
          <CardLabel>Entradas</CardLabel>
          <CardValue $variant="income">{formatCurrency(totalIncome)}</CardValue>
        </SummaryCard>
        <SummaryCard>
          <CardLabel>Saídas</CardLabel>
          <CardValue $variant="expense">{formatCurrency(totalExpense)}</CardValue>
        </SummaryCard>
        <SummaryCard>
          <CardLabel>Saldo</CardLabel>
          <CardValue $variant={balance >= 0 ? 'income' : 'expense'}>{formatCurrency(balance)}</CardValue>
        </SummaryCard>
      </CardsRow>

      {filtered.length === 0 ? (
        <EmptyMessage>Nenhuma transação encontrada para os filtros selecionados.</EmptyMessage>
      ) : (
        <ChartsRow>
          {Object.keys(expensesByCategory).length > 0 && (
            <ChartSection>
              <ChartTitle>Saídas por Categoria</ChartTitle>
              <Pie data={pieData} />
            </ChartSection>
          )}
          {sortedMonths.length > 0 && (
            <ChartSection>
              <ChartTitle>Histórico por Mês</ChartTitle>
              <Line data={lineData} />
            </ChartSection>
          )}
        </ChartsRow>
      )}

      <ExportButton type="button" onClick={exportPDF} disabled={filtered.length === 0}>
        Exportar PDF
      </ExportButton>
    </Container>
  )
}
