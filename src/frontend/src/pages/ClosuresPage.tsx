import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { t } from '@/lib/i18n';

export default function ClosuresPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('closures.title')}</h1>
        <p className="text-muted-foreground">{t('closures.subtitle')}</p>
      </div>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertTitle>{t('closures.backend_required')}</AlertTitle>
        <AlertDescription>
          {t('closures.backend_description')}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('closures.module_title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t('closures.module_description')}
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>{t('closures.feature_1')}</li>
            <li>{t('closures.feature_2')}</li>
            <li>{t('closures.feature_3')}</li>
            <li>{t('closures.feature_4')}</li>
            <li>{t('closures.feature_5')}</li>
            <li>{t('closures.feature_6')}</li>
            <li>{t('closures.feature_7')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
