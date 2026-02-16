import { useState } from 'react';
import { useCustomers, useCreateCustomer, useModifyCustomer, useDelinquentSales } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import LargeButton from '@/components/LargeButton';
import { generateId } from '@/lib/utils';
import { extractErrorMessage } from '@/lib/errorMessage';
import { formatUSD } from '@/lib/currency';
import { toast } from 'sonner';
import { Users, Eye, AlertCircle, LogIn, Edit, AlertTriangle } from 'lucide-react';
import { t } from '@/lib/i18n';
import type { Customer } from '@/backend';

export default function CustomersPage() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: customers = [], isLoading } = useCustomers();
  const { data: delinquentSales = [] } = useDelinquentSales();
  const createCustomer = useCreateCustomer();
  const modifyCustomer = useModifyCustomer();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    debtUsd: '0',
  });

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const isLoggingIn = loginStatus === 'logging-in';

  const delinquentCustomerNames = new Set(delinquentSales.map(sale => sale.customerName));

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
      setFormData({ name: '', contactInfo: '', debtUsd: '0' });
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      toast.error(`Failed to create customer${errorMsg ? ': ' + errorMsg : ''}`);
      console.error('Create customer error:', error);
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      contactInfo: customer.contactInfo,
      debtUsd: customer.debtUsd.toString(),
    });
    setShowEditDialog(true);
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !editingCustomer) {
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Customer name is required');
      return;
    }

    try {
      await modifyCustomer.mutateAsync({
        id: editingCustomer.id,
        name: formData.name.trim(),
        contactInfo: formData.contactInfo.trim(),
        debtUsd: parseFloat(formData.debtUsd) || 0,
      });
      toast.success(t('customers.success_update'));
      setShowEditDialog(false);
      setEditingCustomer(null);
      setFormData({ name: '', contactInfo: '', debtUsd: '0' });
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      toast.error(`Failed to update customer${errorMsg ? ': ' + errorMsg : ''}`);
      console.error('Update customer error:', error);
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
          <Users className="mr-2 h-5 w-5" />
          {t('customers.add_customer')}
        </LargeButton>
      </div>

      {delinquentSales.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {delinquentSales.length === 1
              ? `${delinquentSales.length} cliente con morosidad mayor a 15 días`
              : `${delinquentSales.length} clientes con morosidad mayor a 15 días`}
          </AlertDescription>
        </Alert>
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
                  <TableHead className="text-right">{t('customers.debt')}</TableHead>
                  <TableHead className="text-right">{t('action.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => {
                  const isDelinquent = delinquentCustomerNames.has(customer.name);
                  return (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {customer.name}
                          {isDelinquent && (
                            <Badge variant="destructive" className="text-xs">
                              {t('customers.delinquent')}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{customer.contactInfo || '-'}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatUSD(customer.debtUsd)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t('action.edit')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewCustomer(customer.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {t('action.view')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('customers.edit_title')}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdateCustomer} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{t('customers.name')}</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('customers.name_placeholder')}
                disabled={!isAuthenticated}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-contactInfo">{t('customers.contact')}</Label>
              <Input
                id="edit-contactInfo"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                placeholder={t('customers.contact_placeholder')}
                disabled={!isAuthenticated}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-debtUsd">{t('customers.debt')}</Label>
              <Input
                id="edit-debtUsd"
                type="number"
                step="0.01"
                value={formData.debtUsd}
                onChange={(e) => setFormData({ ...formData, debtUsd: e.target.value })}
                disabled={!isAuthenticated}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingCustomer(null);
                }}
              >
                {t('action.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={!isAuthenticated || modifyCustomer.isPending}
              >
                {modifyCustomer.isPending ? t('action.updating') : t('action.update')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
