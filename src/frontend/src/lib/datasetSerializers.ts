import type { InventoryItem, Customer, CashboxEntry, ExchangeRate, Supplier, Sale, Closure } from '@/backend';
import { Variant__in_out } from '@/backend';
import { t } from './i18n';

export function serializeInventory(items: InventoryItem[]): any[][] {
  return items.map(item => [
    item.id,
    item.description,
    item.category,
    Number(item.stockCurrent),
    Number(item.stockMin),
    item.costUsd,
    item.sellRetailUsd,
    item.sellWholesaleUsd,
    item.sellSpecialUsd,
    item.profitMarginPercent,
    item.photo ? t('csv.yes') : t('csv.no'),
  ]);
}

export function serializeCustomers(customers: Customer[]): any[][] {
  return customers.map(customer => [
    customer.id,
    customer.name,
    customer.contactInfo,
    customer.debtUsd,
  ]);
}

export function serializeCashboxEntries(entries: CashboxEntry[]): any[][] {
  return entries.map(entry => [
    entry.id,
    (entry.entryType as Variant__in_out) === Variant__in_out._in ? t('csv.in') : t('csv.out'),
    new Date(Number(entry.timestamp) / 1000000).toISOString(),
    entry.currency,
    entry.amountUsd,
    entry.description,
  ]);
}

export function serializeExchangeRates(rates: ExchangeRate[]): any[][] {
  return rates.map(rate => [
    new Date(Number(rate.date) / 1000000).toISOString(),
    rate.bcvVesPerUsd,
    rate.copPerUsd,
  ]);
}

export function serializeSuppliers(suppliers: Supplier[]): any[][] {
  return suppliers.map(supplier => [
    supplier.id,
    supplier.name,
    supplier.contactInfo,
    supplier.address,
    new Date(Number(supplier.createdAt) / 1000000).toISOString(),
  ]);
}

export function serializeSales(sales: Sale[]): any[][] {
  return sales.map(sale => [
    sale.id,
    sale.customerName,
    sale.totalAmountUsd,
    sale.isCreditSale ? t('csv.credit') : t('csv.immediate'),
    new Date(Number(sale.saleTimestamp) / 1000000).toISOString(),
    sale.dueDate ? new Date(Number(sale.dueDate) / 1000000).toISOString() : '',
    sale.itemsSold.length,
  ]);
}

export function serializeClosures(closures: Closure[]): any[][] {
  return closures.map(closure => [
    closure.id,
    closure.openingBalanceUsd,
    closure.closingBalanceUsd,
    closure.totalIncomeUsd,
    closure.totalExpensesUsd,
    closure.createdBy,
    new Date(Number(closure.createdAt) / 1000000).toISOString(),
  ]);
}

export const INVENTORY_HEADERS = [
  t('csv.id'),
  t('csv.description'),
  t('csv.category'),
  t('csv.stock_current'),
  t('csv.stock_min'),
  t('csv.cost_usd'),
  t('csv.sell_retail_usd'),
  t('csv.sell_wholesale_usd'),
  t('csv.sell_special_usd'),
  t('csv.profit_margin'),
  t('csv.has_photo'),
];

export const CUSTOMERS_HEADERS = [
  t('csv.id'),
  t('csv.name'),
  t('csv.contact_info'),
  t('csv.debt_usd'),
];

export const CASHBOX_HEADERS = [
  t('csv.id'),
  t('csv.type'),
  t('csv.timestamp'),
  t('csv.currency'),
  t('csv.amount_usd'),
  t('csv.description'),
];

export const RATES_HEADERS = [
  t('csv.date'),
  t('csv.bcv_ves_per_usd'),
  t('csv.cop_per_usd'),
];

export const SUPPLIERS_HEADERS = [
  t('csv.id'),
  t('csv.name'),
  t('csv.contact_info'),
  t('csv.address'),
  t('csv.created_at'),
];

export const SALES_HEADERS = [
  t('csv.id'),
  t('csv.customer_name'),
  t('csv.total_amount'),
  t('csv.sale_type'),
  t('csv.sale_date'),
  t('csv.due_date'),
  t('csv.items_count'),
];

export const CLOSURES_HEADERS = [
  t('csv.id'),
  t('csv.opening_balance'),
  t('csv.closing_balance'),
  t('csv.total_income'),
  t('csv.total_expenses'),
  t('csv.created_by'),
  t('csv.created_at'),
];
