import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/Button/Button'
import { Container, Form, Title, Input, ErrorMessage } from './Styles'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch {
      setError('Credenciais inválidas. Verifique seu e-mail e senha.')
    }
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Entrar</Title>
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit">Entrar</Button>
      </Form>
    </Container>
  )
}
