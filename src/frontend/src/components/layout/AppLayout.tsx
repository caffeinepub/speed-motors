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
} from 'lucide-react';
import { useState } from 'react';
import GlobalSearch from '../search/GlobalSearch';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Panel', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventario', href: '/inventory', icon: Package },
  { name: 'Tasas', href: '/rates', icon: DollarSign },
  { name: 'Ventas', href: '/sales', icon: ShoppingCart },
  { name: 'Clientes', href: '/customers', icon: Users },
  { name: 'Caja', href: '/cashbox', icon: Wallet },
  { name: 'Proveedores', href: '/suppliers', icon: Truck },
  { name: 'Cierres', href: '/closures', icon: FileText },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Package className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">Speed Motors</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg border bg-muted/50 px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Buscar productos...</span>
              <kbd className="hidden rounded border bg-background px-2 py-0.5 text-xs sm:inline">
                Ctrl+K
              </kbd>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex">
        {/* Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 flex-col border-r bg-card p-4 lg:flex">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = currentPath === item.href || (item.href !== '/dashboard' && currentPath.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Speed Motors. Hecho con ❤️ usando{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'speed-motors'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Global Search Modal */}
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
