import { useState } from 'react';
import { useSuppliers, useCreateSupplier, useModifySupplier } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import LargeButton from '@/components/LargeButton';
import { generateId } from '@/lib/utils';
import { extractErrorMessage } from '@/lib/errorMessage';
import { toast } from 'sonner';
import { Truck, Eye, Edit, AlertCircle, LogIn } from 'lucide-react';
import { t } from '@/lib/i18n';
import type { Supplier } from '@/backend';

export default function SuppliersPage() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: suppliers = [], isLoading } = useSuppliers();
  const createSupplier = useCreateSupplier();
  const modifySupplier = useModifySupplier();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    address: '',
  });

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const isLoggingIn = loginStatus === 'logging-in';

  const handleSignIn = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(t('auth.sign_in_error'));
    }
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Supplier name is required');
      return;
    }

    try {
      await createSupplier.mutateAsync({
        id: generateId(),
        name: formData.name.trim(),
        contactInfo: formData.contactInfo.trim(),
        address: formData.address.trim(),
      });
      toast.success(t('suppliers.success_create'));
      setShowCreateDialog(false);
      setFormData({ name: '', contactInfo: '', address: '' });
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      toast.error(`Failed to create supplier${errorMsg ? ': ' + errorMsg : ''}`);
      console.error('Create supplier error:', error);
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactInfo: supplier.contactInfo,
      address: supplier.address,
    });
    setShowEditDialog(true);
  };

  const handleUpdateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !editingSupplier) {
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Supplier name is required');
      return;
    }

    try {
      await modifySupplier.mutateAsync({
        id: editingSupplier.id,
        name: formData.name.trim(),
        contactInfo: formData.contactInfo.trim(),
        address: formData.address.trim(),
      });
      toast.success(t('suppliers.success_update'));
      setShowEditDialog(false);
      setEditingSupplier(null);
      setFormData({ name: '', contactInfo: '', address: '' });
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      toast.error(`Failed to update supplier${errorMsg ? ': ' + errorMsg : ''}`);
      console.error('Update supplier error:', error);
    }
  };

  const handleViewSupplier = (supplierId: string) => {
    navigate({ to: `/suppliers/${supplierId}` });
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
        <h1 className="text-3xl font-bold">{t('nav.suppliers')}</h1>
        <LargeButton onClick={() => setShowCreateDialog(true)}>
          <Truck className="mr-2 h-5 w-5" />
          {t('suppliers.add_supplier')}
        </LargeButton>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('suppliers.list_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {suppliers.length === 0 ? (
            <p className="text-center text-muted-foreground">{t('suppliers.no_suppliers')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('suppliers.name')}</TableHead>
                  <TableHead>{t('suppliers.contact')}</TableHead>
                  <TableHead>{t('suppliers.address')}</TableHead>
                  <TableHead className="text-right">{t('action.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contactInfo || '-'}</TableCell>
                    <TableCell>{supplier.address || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSupplier(supplier)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t('action.edit')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewSupplier(supplier.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t('action.view')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('suppliers.create_title')}</DialogTitle>
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

          <form onSubmit={handleCreateSupplier} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('suppliers.name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('suppliers.name_placeholder')}
                disabled={!isAuthenticated}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">{t('suppliers.contact')}</Label>
              <Input
                id="contactInfo"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                placeholder={t('suppliers.contact_placeholder')}
                disabled={!isAuthenticated}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{t('suppliers.address')}</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder={t('suppliers.address_placeholder')}
                rows={3}
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
                disabled={!isAuthenticated || createSupplier.isPending}
              >
                {createSupplier.isPending ? t('action.creating') : t('action.create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('suppliers.edit_title')}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdateSupplier} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{t('suppliers.name')}</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('suppliers.name_placeholder')}
                disabled={!isAuthenticated}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-contactInfo">{t('suppliers.contact')}</Label>
              <Input
                id="edit-contactInfo"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                placeholder={t('suppliers.contact_placeholder')}
                disabled={!isAuthenticated}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">{t('suppliers.address')}</Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder={t('suppliers.address_placeholder')}
                rows={3}
                disabled={!isAuthenticated}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingSupplier(null);
                }}
              >
                {t('action.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={!isAuthenticated || modifySupplier.isPending}
              >
                {modifySupplier.isPending ? t('action.updating') : t('action.update')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
