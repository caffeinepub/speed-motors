export function calculatePriceWithMargin(costUsd: number, profitMarginPercent: number): number {
  const marginAmount = costUsd * (profitMarginPercent / 100);
  return Math.round((costUsd + marginAmount) * 100) / 100;
}

export function calculateMarginFromPrice(costUsd: number, sellPrice: number): number {
  if (costUsd === 0) return 0;
  const margin = ((sellPrice - costUsd) / costUsd) * 100;
  return Math.round(margin * 100) / 100;
}
