import styled from 'styled-components'

export const Nav = styled.nav`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: #1a1a2e;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`

export const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`

export const NavLink = styled.a`
  color: #ccc;
  text-decoration: none;
  font-size: 0.95rem;
  &:hover {
    color: #fff;
  }
`

export const LogoutButton = styled.button`
  background: none;
  border: 1px solid #ccc;
  color: #ccc;
  padding: 0.35rem 0.85rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`
