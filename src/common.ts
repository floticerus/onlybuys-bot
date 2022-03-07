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

/** this nasty hardcoded switch on router address is probably bad. move to config eventually. */
export const getWethFunctionForRouter = (routerAddress: string) => {
  switch (routerAddress) {
    case '0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56': // netswap
      return 'Metis'
    case '0x60aE616a2155Ee3d9A68541Ba4544862310933d4': // trader-joe
    case '0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106': // pangolin
      return 'WAVAX'
    default:
      return 'WETH'
  }
}

/** this nasty hardcoded switch on router address is probably bad. move to config eventually. */
export const getBuyFunctionForRouter = (routerAddress: string) => {
  switch (routerAddress) {
    case '0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56': // netswap
      return 'swapExactMetisForTokensSupportingFeeOnTransferTokens'
    case '0x60aE616a2155Ee3d9A68541Ba4544862310933d4': // trader-joe
    case '0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106': // pangolin
      return 'swapExactAVAXForTokensSupportingFeeOnTransferTokens'
    default:
      return 'swapExactETHForTokensSupportingFeeOnTransferTokens'
  }
}
