import 'dotenv/config'
import { Wallet } from 'ethers'

const { fromMnemonic } = Wallet

const wallet = fromMnemonic(process.env.MNEMONIC)

console.log(`Private key for ${wallet.address}: ${wallet.privateKey}`)
