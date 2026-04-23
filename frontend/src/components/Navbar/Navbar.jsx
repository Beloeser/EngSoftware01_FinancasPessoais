import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Nav, NavLinks, NavLink, LogoutButton } from './Styles'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <Nav>
      <NavLinks>
        {user && (
          <>
            <NavLink as={Link} to="/dashboard">Transações</NavLink>
            <NavLink as={Link} to="/visao-geral">Visão Geral</NavLink>
            <NavLink as={Link} to="/categories">Categorias</NavLink>
          </>
        )}
      </NavLinks>
      {user && <LogoutButton type="button" onClick={handleLogout}>Sair</LogoutButton>}
    </Nav>
  )
}
