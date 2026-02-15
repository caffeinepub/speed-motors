import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import LargeButton from '@/components/LargeButton';
import { t } from '@/lib/i18n';

export default function SupplierDetailPage() {
  const { supplierId } = useParams({ from: '/suppliers/$supplierId' });
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <LargeButton variant="outline" onClick={() => navigate({ to: '/suppliers' })}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          {t('action.back')}
        </LargeButton>
        <div>
          <h1 className="text-3xl font-bold">{t('supplier_detail.title')}</h1>
          <p className="text-muted-foreground">ID: {supplierId}</p>
        </div>
      </div>

      <Alert>
        <Truck className="h-4 w-4" />
        <AlertTitle>{t('suppliers.backend_required')}</AlertTitle>
        <AlertDescription>
          {t('supplier_detail.backend_description')}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>{t('supplier_detail.info_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t('supplier_detail.info_description')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
