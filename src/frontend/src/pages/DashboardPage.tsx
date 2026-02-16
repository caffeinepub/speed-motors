import { LayoutDashboard, Package, Users, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useInventory, useCustomers, useDelinquentSales, useCashboxTotals } from '@/hooks/useQueries';
import { formatUSD } from '@/lib/currency';
import { t } from '@/lib/i18n';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { data: inventory = [], isLoading: inventoryLoading } = useInventory();
  const { data: customers = [], isLoading: customersLoading } = useCustomers();
  const { data: delinquentSales = [], isLoading: delinquentLoading } = useDelinquentSales();
  const { data: cashboxTotals } = useCashboxTotals();

  const lowStockItems = inventory.filter(item => item.stockCurrent <= item.stockMin);
  const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.costUsd * Number(item.stockCurrent)), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>

      {/* Alerts Section */}
      {(lowStockItems.length > 0 || delinquentSales.length > 0) && (
        <div className="space-y-4">
          {lowStockItems.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('dashboard.low_stock_alert')}</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>
                  {lowStockItems.length === 1
                    ? t('inventory.low_stock_description', { count: lowStockItems.length.toString() })
                    : t('inventory.low_stock_description_plural', { count: lowStockItems.length.toString() })}
                </span>
                <Link to="/inventory">
                  <Button variant="outline" size="sm">
                    {t('action.view')}
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {delinquentSales.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('dashboard.delinquent_alert')}</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>
                  {delinquentSales.length === 1
                    ? `${delinquentSales.length} cliente con morosidad mayor a 15 días`
                    : `${delinquentSales.length} clientes con morosidad mayor a 15 días`}
                </span>
                <Link to="/customers">
                  <Button variant="outline" size="sm">
                    {t('action.view')}
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.total_products')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryLoading ? '...' : inventory.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.inventory_value')}: {formatUSD(totalInventoryValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.total_customers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersLoading ? '...' : customers.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.active_customers')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.low_stock')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {inventoryLoading ? '...' : lowStockItems.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.items_below_minimum')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.delinquent_sales')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {delinquentLoading ? '...' : delinquentSales.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.overdue_15_days')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cashbox Summary */}
      {cashboxTotals && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {t('dashboard.cashbox_summary')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">USD</p>
                <p className="text-2xl font-bold">{formatUSD(cashboxTotals.usd)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">VES</p>
                <p className="text-2xl font-bold">{cashboxTotals.ves.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">COP</p>
                <p className="text-2xl font-bold">{cashboxTotals.cop.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.quick_actions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/inventory">
              <Button variant="outline" className="w-full">
                <Package className="mr-2 h-4 w-4" />
                {t('nav.inventory')}
              </Button>
            </Link>
            <Link to="/sales">
              <Button variant="outline" className="w-full">
                <DollarSign className="mr-2 h-4 w-4" />
                {t('nav.sales')}
              </Button>
            </Link>
            <Link to="/customers">
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                {t('nav.customers')}
              </Button>
            </Link>
            <Link to="/rates">
              <Button variant="outline" className="w-full">
                <TrendingUp className="mr-2 h-4 w-4" />
                {t('nav.rates')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
