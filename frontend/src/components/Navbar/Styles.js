import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

export const Nav = styled.nav`
  width: 100%;
  padding: 0.9rem 1.25rem;
  background: #0f3460;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`

export const Brand = styled.strong`
  font-size: 1rem;
`

export const Links = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

export const LinkItem = styled(NavLink)`
  color: #d8e6ff;
  text-decoration: none;
  font-size: 0.95rem;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
    color: #fff;
  }

  &.active {
    background: rgba(255, 255, 255, 0.22);
    color: #fff;
  }
`

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const UserLabel = styled.span`
  font-size: 0.9rem;
  color: #d8e6ff;
`

export const LogoutButton = styled.button`
  padding: 0.45rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 6px;
  background: transparent;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.16);
  }
`
