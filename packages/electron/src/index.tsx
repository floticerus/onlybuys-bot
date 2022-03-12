import ReactDOM from 'react-dom'
import './index.css'
import { App } from './App'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCheck,
  faTerminal,
  faCog,
  faRobot,
  faCircle,
  faPlay,
  faStop,
  faCircleNotch,
  faBars,
  faClock,
  faMoneyBill1Wave,
  faMoneyBillWave,
  faTimes,
  faWallet,
} from '@fortawesome/free-solid-svg-icons'
import { faBitcoin } from '@fortawesome/free-brands-svg-icons'

library.add(
  faCheck,
  faTerminal,
  faCog,
  faRobot,
  faCircle,
  faPlay,
  faStop,
  faCircleNotch,
  faBars,
  faClock,
  faMoneyBill1Wave,
  faMoneyBillWave,
  faBitcoin,
  faTimes,
  faWallet,
)

ReactDOM.render(<App />, document.getElementById('root'))
