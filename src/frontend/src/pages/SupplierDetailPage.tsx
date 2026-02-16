import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Truck, MapPin, Phone, Calendar, Edit } from 'lucide-react';
import { useSuppliers, useModifySupplier } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import LargeButton from '@/components/LargeButton';
import { extractErrorMessage } from '@/lib/errorMessage';
import { toast } from 'sonner';
import { t } from '@/lib/i18n';

export default function SupplierDetailPage() {
  const { supplierId } = useParams({ from: '/suppliers/$supplierId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: suppliers = [], isLoading } = useSuppliers();
  const modifySupplier = useModifySupplier();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    address: '',
  });

  const supplier = suppliers.find((s) => s.id === supplierId);
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const handleEditClick = () => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contactInfo: supplier.contactInfo,
        address: supplier.address,
      });
      setShowEditDialog(true);
    }
  };

  const handleUpdateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !supplier) {
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Supplier name is required');
      return;
    }

    try {
      await modifySupplier.mutateAsync({
        id: supplier.id,
        name: formData.name.trim(),
        contactInfo: formData.contactInfo.trim(),
        address: formData.address.trim(),
      });
      toast.success(t('suppliers.success_update'));
      setShowEditDialog(false);
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      toast.error(`Failed to update supplier${errorMsg ? ': ' + errorMsg : ''}`);
      console.error('Update supplier error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <LargeButton variant="outline" onClick={() => navigate({ to: '/suppliers' })}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            {t('action.back')}
          </LargeButton>
          <div>
            <h1 className="text-3xl font-bold">{t('supplier_detail.not_found')}</h1>
          </div>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t('supplier_detail.not_found_description')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LargeButton variant="outline" onClick={() => navigate({ to: '/suppliers' })}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            {t('action.back')}
          </LargeButton>
          <div>
            <h1 className="text-3xl font-bold">{supplier.name}</h1>
            <p className="text-sm text-muted-foreground">ID: {supplier.id}</p>
          </div>
        </div>
        <Button onClick={handleEditClick} disabled={!isAuthenticated}>
          <Edit className="mr-2 h-4 w-4" />
          {t('action.edit')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {t('supplier_detail.info_title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Phone className="mt-1 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{t('suppliers.contact_info')}</p>
              <p className="text-sm text-muted-foreground">{supplier.contactInfo}</p>
            </div>
          </div>

          {supplier.address && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t('suppliers.address')}</p>
                <p className="text-sm text-muted-foreground">{supplier.address}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{t('supplier_detail.created_at')}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(Number(supplier.createdAt) / 1000000).toLocaleString('es-ES')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                onClick={() => setShowEditDialog(false)}
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
