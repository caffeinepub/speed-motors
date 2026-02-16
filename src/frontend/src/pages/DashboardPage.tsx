import { TrendingUp, Package, Users, DollarSign, AlertTriangle, BarChart3, Search, TrendingDown, Download, Terminal, FileText, Code } from 'lucide-react';
import { 
  useInventory, 
  useCustomers, 
  useCashboxTotals, 
  useDelinquentSales,
  useTopItemsSold,
  useTopSearchedProducts,
  useNetProfitByInterval,
  useBuildArtifactsInfo
} from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatUSD } from '@/lib/currency';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { t, plural } from '@/lib/i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useStaticArtifactAvailability } from '@/hooks/useStaticArtifactAvailability';

export default function DashboardPage() {
  const { data: inventory = [], isLoading: inventoryLoading } = useInventory();
  const { data: customers = [], isLoading: customersLoading } = useCustomers();
  const { data: cashboxTotals, isLoading: cashboxLoading } = useCashboxTotals();
  const { data: overdueSales = [], isLoading: overdueLoading } = useDelinquentSales();
  const { identity } = useInternetIdentity();

  // Analytics state
  const [topItemsCount, setTopItemsCount] = useState<number>(5);
  const [topSearchCount, setTopSearchCount] = useState<number>(5);
  const [profitInterval, setProfitInterval] = useState<string>('day');

  // Build artifacts state
  const [showBuildInfo, setShowBuildInfo] = useState(false);
  const { data: buildArtifactsInfo, isLoading: buildInfoLoading, error: buildInfoError } = useBuildArtifactsInfo();
  const { data: artifactAvailability, isLoading: artifactsLoading } = useStaticArtifactAvailability();

  // Analytics queries - convert number to bigint
  const { data: topItemsSold = [], isLoading: topItemsLoading } = useTopItemsSold(BigInt(topItemsCount));
  const { data: topSearchedProducts = [], isLoading: topSearchLoading } = useTopSearchedProducts(BigInt(topSearchCount));
  const { data: netProfitData = [], isLoading: netProfitLoading } = useNetProfitByInterval(profitInterval);

  const lowStockItems = inventory.filter(item => Number(item.stockCurrent) <= Number(item.stockMin));
  const totalDebt = customers.reduce((sum, customer) => sum + customer.debtUsd, 0);
  const overdueCustomers = new Set(overdueSales.map(sale => sale.customerName));

  // Authentication check: treat anonymous principals as unauthenticated
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const handleDownloadZip = () => {
    const link = document.createElement('a');
    link.href = '/artifacts/app-build.zip';
    link.download = 'app-build.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSourceDoc = () => {
    const link = document.createElement('a');
    link.href = '/artifacts/SOURCE_CODE.md';
    link.download = 'SOURCE_CODE.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSourceZip = () => {
    const link = document.createElement('a');
    link.href = '/artifacts/source-code.zip';
    link.download = 'source-code.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      {/* Full Project Export Section - Only visible when authenticated */}
      {isAuthenticated && (
        <Card className="border-dashed">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Full Project Export</CardTitle>
            </div>
            <CardDescription>
              Download the complete application package or source code for deployment and offline reference
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {artifactsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : artifactAvailability?.zipAvailable || artifactAvailability?.sourceDocAvailable || artifactAvailability?.sourceZipAvailable ? (
              <div className="space-y-3">
                {artifactAvailability.zipAvailable && (
                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Complete Build Package</p>
                        <p className="text-sm text-muted-foreground">
                          ZIP archive containing backend WASM, frontend build, deployment instructions, and source code document
                        </p>
                      </div>
                      <Button onClick={handleDownloadZip} size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download ZIP
                      </Button>
                    </div>
                  </div>
                )}

                {artifactAvailability.sourceZipAvailable && (
                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Full Source Code (ZIP)</p>
                        <p className="text-sm text-muted-foreground">
                          Complete editable project source tree (backend, frontend, configs) for offline development and rebuilding
                        </p>
                      </div>
                      <Button onClick={handleDownloadSourceZip} size="sm" variant="secondary">
                        <Code className="h-4 w-4 mr-2" />
                        Download Source
                      </Button>
                    </div>
                  </div>
                )}

                {artifactAvailability.sourceDocAvailable && (
                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Source Code Document</p>
                        <p className="text-sm text-muted-foreground">
                          Single Markdown file with complete source code for offline reading
                        </p>
                      </div>
                      <Button onClick={handleDownloadSourceDoc} size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Download Markdown
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <p className="text-sm font-medium">To generate the build artifacts locally:</p>
                  <div className="bg-background rounded p-3 font-mono text-sm">
                    cd frontend && pnpm run package-artifact
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Expected outputs in <code className="bg-background px-1 py-0.5 rounded">frontend/public/artifacts/</code>:
                  </p>
                  <ul className="text-xs text-muted-foreground list-disc list-inside ml-2 space-y-1">
                    <li><code className="bg-background px-1 py-0.5 rounded">app-build.zip</code> - Deployable build package</li>
                    <li><code className="bg-background px-1 py-0.5 rounded">source-code.zip</code> - Full editable source tree</li>
                    <li><code className="bg-background px-1 py-0.5 rounded">SOURCE_CODE.md</code> - Source code document</li>
                  </ul>
                </div>

                <Alert>
                  <AlertDescription className="text-xs">
                    <strong>Note:</strong> The packaging script must be run from your local development environment. 
                    It requires dfx and pnpm to be installed. See <code>frontend/scripts/README.md</code> for complete documentation.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBuildInfo(!showBuildInfo)}
                disabled={buildInfoLoading}
              >
                <Terminal className="h-4 w-4 mr-2" />
                {buildInfoLoading ? 'Loading...' : showBuildInfo ? 'Hide Backend Info' : 'Show Backend Info'}
              </Button>
            </div>

            {showBuildInfo && (
              <div className="rounded-lg border p-4 space-y-2">
                {buildInfoLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : buildInfoError ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Backend Info Unavailable</AlertTitle>
                    <AlertDescription className="text-xs">
                      {buildInfoError.message || 'This feature is only available in development environments.'}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Backend Build Information:</p>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      {buildArtifactsInfo}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
                  <div key={item.productId} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{item.productDetails.description}</p>
                        <p className="text-xs text-muted-foreground">{item.productDetails.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{Number(item.salesCount)}</p>
                      <p className="text-xs text-muted-foreground">{t('analytics.sales')}</p>
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
                  <div key={item.searchTerm} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        #{index + 1}
                      </Badge>
                      <p className="font-medium text-sm">{item.searchTerm}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{Number(item.searchCount)}</p>
                      <p className="text-xs text-muted-foreground">{t('analytics.searches')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Net Profit Analysis */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-primary" />
            <CardTitle>{t('analytics.net_profit_analysis')}</CardTitle>
          </div>
          <Select value={profitInterval} onValueChange={setProfitInterval}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {netProfitLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
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
                <div key={entry.period} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">{entry.period}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('analytics.margin')}: {entry.profitMargin.toFixed(2)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${entry.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatUSD(entry.netProfit)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
