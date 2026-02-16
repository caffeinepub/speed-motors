import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, User, Phone, DollarSign, Edit } from 'lucide-react';
import { useCustomer, useModifyCustomer } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import LargeButton from '@/components/LargeButton';
import OverdueCreditAlert from '@/components/customers/OverdueCreditAlert';
import { formatUSD } from '@/lib/currency';
import { extractErrorMessage } from '@/lib/errorMessage';
import { toast } from 'sonner';
import { t } from '@/lib/i18n';

export default function CustomerDetailPage() {
  const { customerId } = useParams({ from: '/customers/$customerId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: customer, isLoading } = useCustomer(customerId);
  const modifyCustomer = useModifyCustomer();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    debtUsd: '0',
  });

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const handleEditClick = () => {
    if (customer) {
      setFormData({
        name: customer.name,
        contactInfo: customer.contactInfo,
        debtUsd: customer.debtUsd.toString(),
      });
      setShowEditDialog(true);
    }
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !customer) {
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Customer name is required');
      return;
    }

    try {
      await modifyCustomer.mutateAsync({
        id: customer.id,
        name: formData.name.trim(),
        contactInfo: formData.contactInfo.trim(),
        debtUsd: parseFloat(formData.debtUsd) || 0,
      });
      toast.success(t('customers.success_update'));
      setShowEditDialog(false);
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      toast.error(`Failed to update customer${errorMsg ? ': ' + errorMsg : ''}`);
      console.error('Update customer error:', error);
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

  if (!customer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <LargeButton variant="outline" onClick={() => navigate({ to: '/customers' })}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            {t('action.back')}
          </LargeButton>
          <div>
            <h1 className="text-3xl font-bold">{t('customer_detail.not_found')}</h1>
          </div>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t('customer_detail.not_found_description')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LargeButton variant="outline" onClick={() => navigate({ to: '/customers' })}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            {t('action.back')}
          </LargeButton>
          <div>
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <p className="text-sm text-muted-foreground">ID: {customer.id}</p>
          </div>
        </div>
        <Button onClick={handleEditClick} disabled={!isAuthenticated}>
          <Edit className="mr-2 h-4 w-4" />
          {t('action.edit')}
        </Button>
      </div>

      <OverdueCreditAlert customerName={customer.name} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('customer_detail.info_title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Phone className="mt-1 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{t('customers.contact_info')}</p>
              <p className="text-sm text-muted-foreground">{customer.contactInfo}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="mt-1 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{t('customers.current_debt')}</p>
              <p className="text-lg font-bold">{formatUSD(customer.debtUsd)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                onClick={() => setShowEditDialog(false)}
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
