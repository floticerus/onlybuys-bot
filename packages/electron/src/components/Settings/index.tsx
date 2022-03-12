import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Button } from '../Button'
import { Container, TopBar, Header } from './styles'
import * as StyledForm from '../StyledForm'

export const Settings: React.FC = () => {
  return (
    <Container>
      <TopBar>
        <Header>Settings</Header>

        <Button
          className="flex justify-center items-center"
          $round={true}
          onClick={() => window.history.back()}
        >
          <FontAwesomeIcon icon="times" size="lg" fixedWidth />
        </Button>
      </TopBar>

      <StyledForm.default>
        <StyledForm.Row>
          <StyledForm.Label htmlFor="privatekey">Private key</StyledForm.Label>

          <StyledForm.Input
            id="privatekey"
            type="password"
            placeholder=""
            defaultValue={(window.Main.store.get('privatekey') ?? '') as string}
            onInput={(e) => {
              window.Main.store.set('privatekey', e.currentTarget.value)
            }}
          />
        </StyledForm.Row>
      </StyledForm.default>
    </Container>
  )
}
