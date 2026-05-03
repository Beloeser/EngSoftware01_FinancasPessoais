import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  Nav,
  Left,
  Brand,
  Links,
  LinkItem,
  Right,
  UserLabel,
  LogoutButton,
} from './Styles'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Nav>
      <Left>
        <Brand>Finanças Pessoais</Brand>
        <Links>
          <LinkItem to="/dashboard">Dashboard</LinkItem>
          <LinkItem to="/visao-geral">Visão Geral</LinkItem>
          <LinkItem to="/categories">Categorias</LinkItem>
        </Links>
      </Left>
      <Right>
        <UserLabel>{user?.name ? `Olá, ${user.name}` : 'Usuário autenticado'}</UserLabel>
        <LogoutButton type="button" onClick={handleLogout}>
          Sair
        </LogoutButton>
      </Right>
    </Nav>
  )
}
