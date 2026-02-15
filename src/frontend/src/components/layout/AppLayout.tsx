import { Link, useRouterState } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Package, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Wallet, 
  Truck, 
  FileText,
  Search,
  Download,
} from 'lucide-react';
import { useState } from 'react';
import GlobalSearch from '../search/GlobalSearch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useInventory, useCustomers, useCashboxEntries, useExchangeRates } from '@/hooks/useQueries';
import { arrayToCSV, downloadCSV } from '@/lib/csvExport';
import { 
  serializeInventory, 
  serializeCustomers, 
  serializeCashboxEntries, 
  serializeExchangeRates,
  INVENTORY_HEADERS,
  CUSTOMERS_HEADERS,
  CASHBOX_HEADERS,
  RATES_HEADERS,
} from '@/lib/datasetSerializers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';

const navigation = [
  { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
  { name: t('nav.inventory'), href: '/inventory', icon: Package },
  { name: t('nav.rates'), href: '/rates', icon: DollarSign },
  { name: t('nav.sales'), href: '/sales', icon: ShoppingCart },
  { name: t('nav.customers'), href: '/customers', icon: Users },
  { name: t('nav.cashbox'), href: '/cashbox', icon: Wallet },
  { name: t('nav.suppliers'), href: '/suppliers', icon: Truck },
  { name: t('nav.closures'), href: '/closures', icon: FileText },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [showSearch, setShowSearch] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { data: inventory = [] } = useInventory();
  const { data: customers = [] } = useCustomers();
  const { data: cashboxEntries = [] } = useCashboxEntries();
  const { data: exchangeRates = [] } = useExchangeRates();

  const handleExport = async () => {
    setExporting(true);
    try {
      const timestamp = new Date().toISOString().split('T')[0];

      // Export Inventory
      const inventoryCSV = arrayToCSV(INVENTORY_HEADERS, serializeInventory(inventory));
      downloadCSV(`inventario_${timestamp}.csv`, inventoryCSV);

      // Export Customers
      const customersCSV = arrayToCSV(CUSTOMERS_HEADERS, serializeCustomers(customers));
      downloadCSV(`clientes_${timestamp}.csv`, customersCSV);

      // Export Cashbox
      const cashboxCSV = arrayToCSV(CASHBOX_HEADERS, serializeCashboxEntries(cashboxEntries));
      downloadCSV(`caja_${timestamp}.csv`, cashboxCSV);

      // Export Exchange Rates
      const ratesCSV = arrayToCSV(RATES_HEADERS, serializeExchangeRates(exchangeRates));
      downloadCSV(`tasas_cambio_${timestamp}.csv`, ratesCSV);

      toast.success(t('export.success'));
      setShowExport(false);
    } catch (error) {
      toast.error(t('export.error'));
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              <span className="text-xl font-bold">Speed Motors</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSearch(true)}
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">{t('action.search')}</span>
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExport(true)}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{t('action.export')}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r bg-muted/40 lg:block">
          <nav className="space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Speed Motors. {t('footer.rights')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('footer.built_with')}{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Global Search Dialog */}
      <GlobalSearch open={showSearch} onOpenChange={setShowSearch} />

      {/* Export Dialog */}
      <Dialog open={showExport} onOpenChange={setShowExport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('export.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('export.description')}
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>{t('export.inventory')} ({inventory.length} {t('export.items')})</li>
              <li>{t('export.customers')} ({customers.length} {t('nav.customers').toLowerCase()})</li>
              <li>{t('export.cashbox_entries')} ({cashboxEntries.length} {t('export.entries')})</li>
              <li>{t('export.exchange_rates')} ({exchangeRates.length} {t('export.rates')})</li>
            </ul>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowExport(false)}>
                {t('action.cancel')}
              </Button>
              <Button onClick={handleExport} disabled={exporting}>
                {exporting ? t('export.exporting') : t('export.action')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
