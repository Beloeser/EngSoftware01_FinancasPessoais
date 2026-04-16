import styled from 'styled-components'

export const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const CategoryItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

export const CategoryName = styled.span`
  font-size: 1rem;
  color: #333;
`

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
  &:hover {
    color: #c0392b;
  }
`

export const EmptyText = styled.p`
  color: #888;
  font-size: 0.9rem;
`
