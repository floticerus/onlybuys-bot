import { providers, Wallet } from 'ethers'
import { network } from './data/networks'

const { WebSocketProvider, JsonRpcProvider } = providers
const { fromMnemonic } = Wallet

export const provider: providers.WebSocketProvider | providers.JsonRpcProvider =
  network.websocketURL
    ? new WebSocketProvider(network.websocketURL, network)
    : new JsonRpcProvider(network.rpcURL, network)

export const wallet: Wallet = new Wallet(
  fromMnemonic(process.env.MNEMONIC).privateKey,
  provider,
)
