import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface InventoryItem {
    id: string;
    stockMin: bigint;
    sellRetailUsd: number;
    sellWholesaleUsd: number;
    description: string;
    stockCurrent: bigint;
    sellSpecialUsd: number;
    category: string;
    photo?: Blob;
    costUsd: number;
}
export type Time = bigint;
export interface ExchangeRate {
    copPerUsd: number;
    bcvVesPerUsd: number;
    date: Time;
}
export interface Customer {
    id: string;
    contactInfo: string;
    name: string;
    debtUsd: number;
}
export type Blob = Uint8Array;
export interface backendInterface {
    addExchangeRate(bcvVesPerUsd: number, copPerUsd: number): Promise<void>;
    convertPriceToCop(usd: number): Promise<number>;
    convertPriceToVes(usd: number): Promise<number>;
    createCustomer(id: string, name: string, contactInfo: string): Promise<Customer>;
    createInventoryItem(id: string, photo: Blob | null, description: string, category: string, stockCurrent: bigint, stockMin: bigint, costUsd: number, sellRetailUsd: number, sellWholesaleUsd: number, sellSpecialUsd: number): Promise<InventoryItem>;
    getCustomer(id: string): Promise<Customer>;
    getInventoryItem(id: string): Promise<InventoryItem>;
    getLatestExchangeRate(): Promise<ExchangeRate>;
    listCustomers(): Promise<Array<Customer>>;
    listExchangeRates(): Promise<Array<ExchangeRate>>;
    listInventory(): Promise<Array<InventoryItem>>;
    searchProducts(searchQuery: string): Promise<Array<InventoryItem>>;
}
