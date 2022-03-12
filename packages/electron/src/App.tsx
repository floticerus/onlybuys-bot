import { GlobalStyle } from './styles/GlobalStyle'
import { HashRouter as Router } from 'react-router-dom'

import { AppLayout } from './components/AppLayout'
// import { Greetings } from './components/Greetings'

export function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <AppLayout />
      </Router>
    </>
  )
}
