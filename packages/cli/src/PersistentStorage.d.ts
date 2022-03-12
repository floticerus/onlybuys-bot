export declare const DEFAULT_DATA_DIR: string;
export interface PersistentStorageOptions {
    dir?: string;
}
export interface SetJSONOptions {
    shallowMerge?: boolean;
}
export default class PersistentStorage {
    constructor({ dir }: PersistentStorageOptions);
    readonly dir: string;
    getItem(key: string): Promise<string | undefined>;
    setItem(key: string, value: string): Promise<void>;
    deleteItem(key: string): Promise<void>;
    hideItem(key: string): Promise<void>;
    showItem(key: string): Promise<void>;
    getJSON<T = object>(key: string): Promise<T | undefined>;
    setJSON<T = object>(key: string, value: T, { shallowMerge }?: SetJSONOptions): Promise<void>;
    getAllFiles(): Promise<string[]>;
    getKeys(): Promise<string[]>;
    getHiddenKeys(): Promise<string[]>;
}
