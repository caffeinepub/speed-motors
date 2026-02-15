import type { InventoryItem, Customer, CashboxEntry, ExchangeRate } from '@/backend';
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
    entry.entryType === '_in' ? t('csv.in') : t('csv.out'),
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
