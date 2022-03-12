import React from 'react'
import { Container, ButtonProps } from './styles'

export const Button: React.FC<ButtonProps> = ({ ...rest }) => {
  return <Container type="button" {...rest} />
}
