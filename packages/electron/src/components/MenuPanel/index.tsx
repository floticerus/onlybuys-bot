import React from 'react'
import { useLocation } from 'react-router'
import {
  Container,
  ButtonArea,
  MenuPanelButton,
  MenuPanelButtonIcon,
} from './styles'
import { Link } from 'react-router-dom'

export const MenuPanel: React.FC = () => {
  const { pathname } = useLocation()

  return (
    <Container>
      <ButtonArea className="overflow-auto">
        <Link to="/">
          <MenuPanelButton
            $active={pathname === '/'}
            children={<MenuPanelButtonIcon icon="robot" />}
          />
        </Link>

        <Link to="/terminal">
          <MenuPanelButton
            $active={pathname.startsWith('/terminal')}
            children={<MenuPanelButtonIcon icon="terminal" />}
          />
        </Link>
      </ButtonArea>

      <ButtonArea>
        {/* <Link to="/account">
          <MenuPanelButton
            $active={pathname.startsWith('/account')}
            children={<MenuPanelButtonIcon icon="wallet" />}
          />
        </Link> */}

        <Link to="/settings">
          <MenuPanelButton
            $active={pathname.startsWith('/settings')}
            children={<MenuPanelButtonIcon icon="cog" />}
          />
        </Link>
      </ButtonArea>
    </Container>
  )
}
