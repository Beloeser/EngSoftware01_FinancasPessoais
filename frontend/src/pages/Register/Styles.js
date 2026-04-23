import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 360px;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
`

export const Title = styled.h1`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
`

export const Input = styled.input`
  padding: 0.65rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #0f3460;
  }
`

export const ErrorMessage = styled.p`
  color: #c0392b;
  font-size: 0.875rem;
`

export const FooterText = styled.p`
  font-size: 0.9rem;
  color: #555;
  text-align: center;
`

export const AuthLink = styled(Link)`
  color: #0f3460;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
