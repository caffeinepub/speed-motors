import { Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { t } from '@/lib/i18n';

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('suppliers.title')}</h1>
        <p className="text-muted-foreground">{t('suppliers.subtitle')}</p>
      </div>

      <Alert>
        <Truck className="h-4 w-4" />
        <AlertTitle>{t('suppliers.backend_required')}</AlertTitle>
        <AlertDescription>
          {t('suppliers.backend_description')}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {t('suppliers.module_title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t('suppliers.module_description')}
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>{t('suppliers.feature_1')}</li>
            <li>{t('suppliers.feature_2')}</li>
            <li>{t('suppliers.feature_3')}</li>
            <li>{t('suppliers.feature_4')}</li>
            <li>{t('suppliers.feature_5')}</li>
            <li>{t('suppliers.feature_6')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
