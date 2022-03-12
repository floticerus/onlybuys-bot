import React from 'react'
import { Container, Form } from './styles'
export * from './styles'

const StyledFrom: React.FC = ({ children }) => {
  return (
    <Container>
      <Form>{children}</Form>
    </Container>
  )
}

export default StyledFrom
