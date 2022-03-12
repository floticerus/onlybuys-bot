export interface CLIOptions {
    readonly network: string;
    readonly networks: string;
    readonly privateKey: string;
    readonly handshakeInterval: string;
    readonly buyAmount: string;
    readonly sellMultiplier: string;
    readonly sellAmount: string;
    readonly minBalance: string;
    readonly minPooledSupply: string;
    readonly minLiquidity: string;
    readonly maxLiquidity: string;
    readonly slippage: string;
    readonly gasPrice: string;
    readonly gasLimit: string;
    readonly blockedNames: string;
    readonly disableTimestamps: boolean;
}
export declare const options: CLIOptions;
