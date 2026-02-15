import { useState } from 'react';
import { Truck, Plus } from 'lucide-react';
import { useSuppliers, useCreateSupplier } from '@/hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import LargeButton from '@/components/LargeButton';
import { generateId } from '@/lib/utils';
import { toast } from 'sonner';
import { t } from '@/lib/i18n';

export default function SuppliersPage() {
  const { data: suppliers = [], isLoading } = useSuppliers();
  const createSupplier = useCreateSupplier();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createSupplier.mutateAsync({
        id: generateId(),
        name: formData.name,
        contactInfo: formData.contactInfo,
        address: formData.address,
      });

      toast.success(t('suppliers.success'));
      setFormData({ name: '', contactInfo: '', address: '' });
      setDialogOpen(false);
    } catch (error) {
      toast.error(t('suppliers.error'));
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('suppliers.title')}</h1>
          <p className="text-muted-foreground">{t('suppliers.subtitle')}</p>
        </div>
        <LargeButton onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-5 w-5" />
          {t('suppliers.add_supplier')}
        </LargeButton>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {t('suppliers.list_title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : suppliers.length === 0 ? (
            <div className="py-12 text-center">
              <Truck className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t('suppliers.no_suppliers')}</p>
              <p className="text-sm text-muted-foreground">{t('suppliers.start_adding')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {suppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  onClick={() => navigate({ to: '/suppliers/$supplierId', params: { supplierId: supplier.id } })}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{supplier.name}</h3>
                    <p className="text-sm text-muted-foreground">{supplier.contactInfo}</p>
                    {supplier.address && (
                      <p className="text-xs text-muted-foreground">{supplier.address}</p>
                    )}
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    {new Date(Number(supplier.createdAt) / 1000000).toLocaleDateString('es-ES')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('suppliers.add_new')}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('suppliers.name')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('suppliers.name_placeholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">{t('suppliers.contact_info')} *</Label>
              <Input
                id="contactInfo"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                placeholder={t('suppliers.contact_placeholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{t('suppliers.address')}</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder={t('suppliers.address_placeholder')}
                rows={2}
              />
            </div>

            <DialogFooter>
              <LargeButton type="submit" disabled={createSupplier.isPending}>
                {createSupplier.isPending ? t('suppliers.adding') : t('action.add')}
              </LargeButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
