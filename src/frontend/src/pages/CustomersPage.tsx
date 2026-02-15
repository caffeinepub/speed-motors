import { useState } from 'react';
import { useCustomers, useCreateCustomer, useDelinquentSales } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import LargeButton from '@/components/LargeButton';
import OverdueCreditAlert from '@/components/customers/OverdueCreditAlert';
import { formatUSD } from '@/lib/currency';
import { generateId } from '@/lib/utils';
import { extractErrorMessage } from '@/lib/errorMessage';
import { toast } from 'sonner';
import { UserPlus, Eye, AlertCircle, LogIn } from 'lucide-react';
import { t } from '@/lib/i18n';

export default function CustomersPage() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: customers = [], isLoading } = useCustomers();
  const { data: delinquentSales = [] } = useDelinquentSales();
  const createCustomer = useCreateCustomer();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
  });

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const isLoggingIn = loginStatus === 'logging-in';

  const overdueCustomers = customers.filter(customer => {
    const customerSales = delinquentSales.filter(sale => sale.customerName === customer.name);
    return customerSales.length > 0;
  });

  const handleSignIn = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(t('auth.sign_in_error'));
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Customer name is required');
      return;
    }

    try {
      await createCustomer.mutateAsync({
        id: generateId(),
        name: formData.name.trim(),
        contactInfo: formData.contactInfo.trim(),
      });
      toast.success(t('customers.success_create'));
      setShowCreateDialog(false);
      setFormData({ name: '', contactInfo: '' });
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      toast.error(`Failed to create customer${errorMsg ? ': ' + errorMsg : ''}`);
      console.error('Create customer error:', error);
    }
  };

  const handleViewCustomer = (customerId: string) => {
    navigate({ to: `/customers/${customerId}` });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{t('action.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('nav.customers')}</h1>
        <LargeButton onClick={() => setShowCreateDialog(true)}>
          <UserPlus className="mr-2 h-5 w-5" />
          {t('customers.add_customer')}
        </LargeButton>
      </div>

      {overdueCustomers.length > 0 && (
        <OverdueCreditAlert variant="default" count={overdueCustomers.length} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('customers.list_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <p className="text-center text-muted-foreground">{t('customers.no_customers')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('customers.name')}</TableHead>
                  <TableHead>{t('customers.contact')}</TableHead>
                  <TableHead>{t('customers.debt')}</TableHead>
                  <TableHead>{t('customers.status')}</TableHead>
                  <TableHead className="text-right">{t('action.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => {
                  const hasOverdue = overdueCustomers.some(c => c.id === customer.id);
                  return (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.contactInfo || '-'}</TableCell>
                      <TableCell>{formatUSD(customer.debtUsd)}</TableCell>
                      <TableCell>
                        {hasOverdue && <OverdueCreditAlert variant="inline" />}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewCustomer(customer.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t('action.view')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('customers.create_title')}</DialogTitle>
          </DialogHeader>

          {!isAuthenticated && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between gap-4">
                <span>{t('auth.sign_in_to_create')}</span>
                <Button
                  onClick={handleSignIn}
                  disabled={isLoggingIn}
                  size="sm"
                  className="gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  {isLoggingIn ? t('auth.signing_in') : t('auth.sign_in')}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleCreateCustomer} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('customers.name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('customers.name_placeholder')}
                disabled={!isAuthenticated}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">{t('customers.contact')}</Label>
              <Input
                id="contactInfo"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                placeholder={t('customers.contact_placeholder')}
                disabled={!isAuthenticated}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                {t('action.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={!isAuthenticated || createCustomer.isPending}
              >
                {createCustomer.isPending ? t('action.creating') : t('action.create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
