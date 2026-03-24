import { StyledButton } from './Styles'

export default function Button({ children, ...props }) {
  return <StyledButton {...props}>{children}</StyledButton>
}
