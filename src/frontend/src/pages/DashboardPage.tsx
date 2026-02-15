import { TrendingUp, Package, Users, DollarSign, AlertTriangle, BarChart3, Search, TrendingDown } from 'lucide-react';
import { 
  useInventory, 
  useCustomers, 
  useCashboxTotals, 
  useOverdueDelinquentSales,
  useTopItemsSold,
  useTopSearchedProducts,
  useNetProfitByInterval
} from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatUSD } from '@/lib/currency';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { t, plural } from '@/lib/i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export default function DashboardPage() {
  const { data: inventory = [], isLoading: inventoryLoading } = useInventory();
  const { data: customers = [], isLoading: customersLoading } = useCustomers();
  const { data: cashboxTotals, isLoading: cashboxLoading } = useCashboxTotals();
  const { data: overdueSales = [], isLoading: overdueLoading } = useOverdueDelinquentSales();

  // Analytics state
  const [topItemsCount, setTopItemsCount] = useState<number>(5);
  const [topSearchCount, setTopSearchCount] = useState<number>(5);
  const [profitInterval, setProfitInterval] = useState<string>('day');

  // Analytics queries - convert number to bigint
  const { data: topItemsSold = [], isLoading: topItemsLoading } = useTopItemsSold(BigInt(topItemsCount));
  const { data: topSearchedProducts = [], isLoading: topSearchLoading } = useTopSearchedProducts(BigInt(topSearchCount));
  const { data: netProfitData = [], isLoading: netProfitLoading } = useNetProfitByInterval(profitInterval);

  const lowStockItems = inventory.filter(item => Number(item.stockCurrent) <= Number(item.stockMin));
  const totalDebt = customers.reduce((sum, customer) => sum + customer.debtUsd, 0);
  const overdueCustomers = new Set(overdueSales.map(sale => sale.customerName));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>

      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('dashboard.low_stock_alert')}</AlertTitle>
          <AlertDescription>
            {lowStockItems.length} {plural(lowStockItems.length, t('dashboard.product'), t('dashboard.products'))} {t('dashboard.below_minimum')}
          </AlertDescription>
        </Alert>
      )}

      {overdueCustomers.size > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('dashboard.overdue_payments')}</AlertTitle>
          <AlertDescription>
            {overdueCustomers.size} {plural(overdueCustomers.size, t('dashboard.customer'), t('dashboard.customers'))} {plural(overdueCustomers.size, t('dashboard.has_overdue'), t('dashboard.have_overdue'))}
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.total_products')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {inventoryLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{inventory.length}</div>
            )}
            {lowStockItems.length > 0 && (
              <Badge variant="destructive" className="mt-2">
                {lowStockItems.length} {t('dashboard.low_stock')}
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.total_customers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {customersLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{customers.length}</div>
            )}
            {overdueCustomers.size > 0 && (
              <Badge variant="destructive" className="mt-2">
                {overdueCustomers.size} {t('dashboard.overdue')}
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.cash_balance')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {cashboxLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {formatUSD(cashboxTotals?.usd || 0)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.total_debt')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {customersLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className={`text-2xl font-bold ${totalDebt > 0 ? 'text-destructive' : ''}`}>
                {formatUSD(totalDebt)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Selling Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle>{t('analytics.top_selling_products')}</CardTitle>
            </div>
            <Select value={topItemsCount.toString()} onValueChange={(v) => setTopItemsCount(Number(v))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Top 5</SelectItem>
                <SelectItem value="10">Top 10</SelectItem>
                <SelectItem value="15">Top 15</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {topItemsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : topItemsSold.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{t('analytics.no_sales_data')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topItemsSold.map((item, index) => (
                  <div key={item.productId} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{item.productDetails.description || item.productDetails.category}</p>
                        <p className="text-sm text-muted-foreground">{item.productDetails.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{Number(item.salesCount)}</p>
                      <p className="text-xs text-muted-foreground">{t('analytics.units_sold')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Searched Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <CardTitle>{t('analytics.top_searched_products')}</CardTitle>
            </div>
            <Select value={topSearchCount.toString()} onValueChange={(v) => setTopSearchCount(Number(v))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Top 5</SelectItem>
                <SelectItem value="10">Top 10</SelectItem>
                <SelectItem value="15">Top 15</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {topSearchLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : topSearchedProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{t('analytics.no_search_data')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topSearchedProducts.map((item, index) => (
                  <div key={item.searchTerm} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        #{index + 1}
                      </Badge>
                      <p className="font-medium">{item.searchTerm}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{Number(item.searchCount)}</p>
                      <p className="text-xs text-muted-foreground">{t('analytics.searches')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Net Profit by Period */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-primary" />
            <CardTitle>{t('analytics.net_profit_by_period')}</CardTitle>
          </div>
          <Select value={profitInterval} onValueChange={setProfitInterval}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">{t('analytics.daily')}</SelectItem>
              <SelectItem value="week">{t('analytics.weekly')}</SelectItem>
              <SelectItem value="month">{t('analytics.monthly')}</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {netProfitLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : netProfitData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{t('analytics.no_profit_data')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {netProfitData.map((entry) => (
                <div key={entry.period} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium">{entry.period}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('analytics.profit_margin')}: {entry.profitMargin.toFixed(2)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${entry.netProfit >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                      {formatUSD(entry.netProfit)}
                    </p>
                    <p className="text-xs text-muted-foreground">{t('analytics.net_profit')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Low Stock Items */}
      {lowStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.low_stock_items')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{item.description || item.category}</p>
                    <p className="text-sm text-muted-foreground">{t('dashboard.category')}: {item.category}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">
                      {Number(item.stockCurrent)} / {Number(item.stockMin)}
                    </Badge>
                  </div>
                </div>
              ))}
              {lowStockItems.length > 5 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  {t('dashboard.and_more', { count: (lowStockItems.length - 5).toString() })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overdue Customers */}
      {overdueCustomers.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.overdue_customers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from(overdueCustomers).slice(0, 5).map((customerName) => {
                const customer = customers.find(c => c.name === customerName);
                const customerSales = overdueSales.filter(s => s.customerName === customerName);
                const totalOverdue = customerSales.reduce((sum, sale) => sum + sale.totalAmountUsd, 0);
                
                return (
                  <div key={String(customerName)} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{String(customerName)}</p>
                      <p className="text-sm text-muted-foreground">
                        {customer?.contactInfo || t('dashboard.no_contact_info')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-destructive">{formatUSD(totalOverdue)}</p>
                      <p className="text-xs text-muted-foreground">
                        {customerSales.length} {plural(customerSales.length, t('dashboard.overdue_sale'), t('dashboard.overdue_sales'))}
                      </p>
                    </div>
                  </div>
                );
              })}
              {overdueCustomers.size > 5 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  {t('dashboard.and_more', { count: (overdueCustomers.size - 5).toString() })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
