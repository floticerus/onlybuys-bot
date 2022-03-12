import 'dotenv/config'
import { maybeSellAll } from './sell'

maybeSellAll().catch(console.error)
