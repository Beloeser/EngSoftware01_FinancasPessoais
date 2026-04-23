import styled from 'styled-components'

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
`

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  color: #333;
  margin-bottom: 1.5rem;
`

export const FiltersRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`

export const FilterInput = styled.input`
  padding: 0.55rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: #0f3460;
  }
`

export const FilterSelect = styled.select`
  padding: 0.55rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
  background: #fff;
  &:focus {
    outline: none;
    border-color: #0f3460;
  }
`

export const ClearButton = styled.button`
  padding: 0.55rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  color: #555;
  &:hover {
    background: #f5f5f5;
  }
`

export const CardsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`

export const SummaryCard = styled.div`
  flex: 1;
  min-width: 160px;
  background: #fff;
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

export const CardLabel = styled.span`
  display: block;
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 0.5rem;
`

export const CardValue = styled.span`
  display: block;
  font-size: 1.35rem;
  font-weight: 700;
  color: ${({ $variant }) =>
    $variant === 'income' ? '#27ae60' : $variant === 'expense' ? '#c0392b' : '#333'};
`

export const ChartsRow = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`

export const ChartSection = styled.div`
  flex: 1;
  min-width: 280px;
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

export const ChartTitle = styled.h3`
  font-size: 1rem;
  color: #555;
  margin: 0 0 1rem;
`

export const ExportButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #0f3460;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: #0a2540;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const EmptyMessage = styled.p`
  color: #888;
  font-size: 0.95rem;
  margin-bottom: 2rem;
`
