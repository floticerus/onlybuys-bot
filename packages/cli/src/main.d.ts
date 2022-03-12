import 'dotenv/config';
import 'cross-fetch/polyfill';
import './get-random-values-shim';
import '@ethersproject/shims/dist';
export interface IPCMessage {
    action: string;
}
export interface IPCMessageRequestLogsGTE extends IPCMessage {
    index: number;
}
export declare function isForkMessageRequestLogsGTE(message: IPCMessage): message is IPCMessageRequestLogsGTE;
