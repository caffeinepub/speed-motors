import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Truck, MapPin, Phone, Calendar } from 'lucide-react';
import { useSuppliers } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import LargeButton from '@/components/LargeButton';
import { t } from '@/lib/i18n';

export default function SupplierDetailPage() {
  const { supplierId } = useParams({ from: '/suppliers/$supplierId' });
  const navigate = useNavigate();
  const { data: suppliers = [], isLoading } = useSuppliers();

  const supplier = suppliers.find((s) => s.id === supplierId);

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
    </div>
  );
}
