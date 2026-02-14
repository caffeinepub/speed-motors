import type { ExchangeRate } from '../backend';

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatVES(amount: number): string {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function convertToVES(usd: number, rate: ExchangeRate | null): number {
  if (!rate) return 0;
  return usd * rate.bcvVesPerUsd;
}

export function convertToCOP(usd: number, rate: ExchangeRate | null): number {
  if (!rate) return 0;
  return usd * rate.copPerUsd;
}

export function formatMultiCurrency(usd: number, rate: ExchangeRate | null): string {
  const ves = convertToVES(usd, rate);
  const cop = convertToCOP(usd, rate);
  return `${formatUSD(usd)} / ${formatVES(ves)} / ${formatCOP(cop)}`;
}
