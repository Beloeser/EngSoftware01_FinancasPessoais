import styled from 'styled-components'

export const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem 1rem;
`

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  color: #333;
  margin-bottom: 1.5rem;
`

export const FormTitle = styled.h2`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
`

export const Input = styled.input`
  display: block;
  width: 100%;
  padding: 0.65rem 0.75rem;
  margin-bottom: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #0f3460;
  }
`

export const Select = styled.select`
  display: block;
  width: 100%;
  padding: 0.65rem 0.75rem;
  margin-bottom: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  background: #fff;
  &:focus {
    outline: none;
    border-color: #0f3460;
  }
`

export const ErrorMessage = styled.p`
  color: #c0392b;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
`

export const HistoryTitle = styled.h2`
  font-size: 1.1rem;
  color: #333;
  margin: 2rem 0 1rem;
`

export const TransactionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const TransactionItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`

export const TransactionDescription = styled.span`
  font-size: 1rem;
  color: #333;
`

export const TransactionMeta = styled.span`
  font-size: 0.8rem;
  color: #888;
  display: block;
  margin-top: 0.2rem;
`

export const TransactionAmount = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ $type }) => ($type === 'income' ? '#27ae60' : '#c0392b')};
`

export const TypeBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $type }) => ($type === 'income' ? '#27ae60' : '#c0392b')};
`

export const ActionButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
  &:hover { color: #c0392b; }
  &[data-action="edit"]:hover { color: #0f3460; }
  &[data-action="confirm"] { color: #c0392b; }
  &[data-action="confirm"]:hover { color: #922b21; }
`
