import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Container, ContentPanel } from './styles'
import { MenuPanel } from '../MenuPanel'
import { Terminal } from '../Terminal'
import { Settings } from '../Settings'
import { BlackHole } from '../BlackHole'
import Toasts from '../Toasts'

export interface AppLayoutProps {
  //
}

export const AppLayout: React.FC<AppLayoutProps> = ({ ...rest }) => {
  return (
    <Container {...rest}>
      <Toasts>
        <MenuPanel />
        <ContentPanel>
          <Routes>
            <Route path="/" element={<BlackHole />} />
            {/* do we really need both? /terminal/:network? wasn't catching /terminal */}
            <Route path="/terminal" element={<Terminal />} />
            <Route path="/terminal/:network" element={<Terminal />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </ContentPanel>
      </Toasts>
    </Container>
  )
}
