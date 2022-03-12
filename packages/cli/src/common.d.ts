import { providers, Wallet } from 'ethers';
export declare const provider: providers.WebSocketProvider | providers.JsonRpcProvider;
export declare const wallet: Wallet;
/** this nasty hardcoded switch on router address is probably bad. move to config eventually. */
export declare const getWethFunctionForRouter: (routerAddress: string) => "WETH" | "Metis" | "WAVAX";
/** this nasty hardcoded switch on router address is probably bad. move to config eventually. */
export declare const getBuyFunctionForRouter: (routerAddress: string) => "swapExactETHForTokensSupportingFeeOnTransferTokens" | "swapExactMetisForTokensSupportingFeeOnTransferTokens" | "swapExactAVAXForTokensSupportingFeeOnTransferTokens";
