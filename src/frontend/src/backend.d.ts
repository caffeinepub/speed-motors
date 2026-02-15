import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface TopSellingProduct {
    productId: string;
    salesCount: bigint;
    productDetails: InventoryItem;
}
export interface TopSearchedProduct {
    searchTerm: string;
    searchCount: bigint;
}
export interface NetProfitEntry {
    period: string;
    profitMargin: number;
    netProfit: number;
}
export interface ExchangeRate {
    copPerUsd: number;
    bcvVesPerUsd: number;
    date: Time;
}
export interface CashboxEntry {
    id: string;
    entryType: Variant__in_out;
    description: string;
    currency: string;
    timestamp: Time;
    amountUsd: number;
}
export interface Sale {
    id: string;
    customerName: string;
    dueDate?: Time;
    totalAmountUsd: number;
    saleTimestamp: Time;
    itemsSold: Array<InventoryItem>;
    isCreditSale: boolean;
}
export interface Customer {
    id: string;
    contactInfo: string;
    name: string;
    debtUsd: number;
}
export type Blob = Uint8Array;
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
    profitMarginPercent: number;
    costUsd: number;
}
export interface RecordSearchEventPayload {
    searchTerm: string;
    timestamp: Time;
}
export interface UpdateInventoryItemPayload {
    stockMin?: bigint;
    sellRetailUsd?: number;
    sellWholesaleUsd?: number;
    description?: string;
    stockCurrent?: bigint;
    sellSpecialUsd?: number;
    category?: string;
    photo?: Blob;
    profitMarginPercent?: number;
    costUsd?: number;
}
export interface UserProfile {
    name: string;
    role: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant__in_out {
    _in = "_in",
    out = "out"
}
export interface backendInterface {
    addCashboxEntry(id: string, entryType: Variant__in_out, amountUsd: number, currency: string, description: string): Promise<void>;
    addExchangeRate(bcvVesPerUsd: number, copPerUsd: number): Promise<void>;
    addProfitMarginToCost(costUsd: number, profitMarginPercent: number): Promise<number>;
    adjustCustomerDebt(id: string, amount: number): Promise<void>;
    aggregateNetProfitByInterval(_interval: string): Promise<Array<NetProfitEntry>>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    convertPriceToCop(usd: number): Promise<number>;
    convertPriceToVes(usd: number): Promise<number>;
    createCustomer(id: string, name: string, contactInfo: string): Promise<Customer>;
    createInventoryItem(id: string, photo: Blob | null, description: string, category: string, profitMarginPercent: number, stockCurrent: bigint, stockMin: bigint, costUsd: number, sellRetailUsd: number, sellWholesaleUsd: number, sellSpecialUsd: number): Promise<InventoryItem>;
    filterInventoryByCategory(category: string): Promise<Array<InventoryItem>>;
    findOverdueDelinquentSales(delinquentSales: Array<Sale>): Promise<Array<Sale>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCashboxTotals(): Promise<{
        cop: number;
        usd: number;
        ves: number;
    }>;
    getCurrentTimestamp(): Promise<bigint>;
    getCustomer(id: string): Promise<Customer>;
    getCustomerDebts(): Promise<Array<[string, number]>>;
    getDistinctCategories(): Promise<Array<string>>;
    getInventoryItem(id: string): Promise<InventoryItem>;
    getLatestExchangeRate(): Promise<ExchangeRate>;
    getTopItemsSold(_count: bigint): Promise<Array<TopSellingProduct>>;
    getTopSearchedProducts(_count: bigint): Promise<Array<TopSearchedProduct>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasDelinquentSales(delinquentSales: Array<Sale>): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    listCashboxEntries(): Promise<Array<CashboxEntry>>;
    listCustomers(): Promise<Array<Customer>>;
    listDelinquentSales(): Promise<Array<Sale>>;
    listExchangeRates(): Promise<Array<ExchangeRate>>;
    listInventory(): Promise<Array<InventoryItem>>;
    postSale(id: string, customerName: string, itemsSold: Array<InventoryItem>, totalAmountUsd: number, isCreditSale: boolean): Promise<void>;
    recordSearchEvent(_payload: RecordSearchEventPayload): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(searchQuery: string): Promise<Array<InventoryItem>>;
    updateInventoryItem(id: string, payload: UpdateInventoryItemPayload): Promise<InventoryItem>;
}
