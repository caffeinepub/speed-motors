import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { t } from '@/lib/i18n';

interface OverdueCreditAlertProps {
  variant?: 'default' | 'inline';
  customerName?: string;
  count?: number;
}

export default function OverdueCreditAlert({ variant = 'default', customerName, count }: OverdueCreditAlertProps) {
  if (variant === 'inline') {
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertCircle className="h-3 w-3" />
        {t('overdue.badge')}
      </Badge>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{t('overdue.alert_title')}</AlertTitle>
      <AlertDescription>
        {customerName ? (
          t('overdue.customer_has', { name: customerName })
        ) : count ? (
          count === 1 ? t('overdue.count_has', { count: count.toString() }) : t('overdue.count_have', { count: count.toString() })
        ) : (
          t('overdue.generic')
        )}
      </AlertDescription>
    </Alert>
  );
}
