import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import RatesPage from './pages/RatesPage';
import SalesPage from './pages/SalesPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import CashboxPage from './pages/CashboxPage';
import SuppliersPage from './pages/SuppliersPage';
import SupplierDetailPage from './pages/SupplierDetailPage';
import ClosuresPage from './pages/ClosuresPage';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventory',
  component: InventoryPage,
});

const ratesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rates',
  component: RatesPage,
});

const salesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sales',
  component: SalesPage,
});

const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  component: CustomersPage,
});

const customerDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers/$customerId',
  component: CustomerDetailPage,
});

const cashboxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cashbox',
  component: CashboxPage,
});

const suppliersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/suppliers',
  component: SuppliersPage,
});

const supplierDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/suppliers/$supplierId',
  component: SupplierDetailPage,
});

const closuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/closures',
  component: ClosuresPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  inventoryRoute,
  ratesRoute,
  salesRoute,
  customersRoute,
  customerDetailRoute,
  cashboxRoute,
  suppliersRoute,
  supplierDetailRoute,
  closuresRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
