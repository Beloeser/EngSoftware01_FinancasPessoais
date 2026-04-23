import styled from 'styled-components'

export const StyledButton = styled.button`
  padding: 0.5rem 1.25rem;
  background: #0f3460;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #1a5276;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`
