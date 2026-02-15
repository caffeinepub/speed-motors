import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { t } from '@/lib/i18n';

interface OverdueCreditAlertProps {
  count?: number;
  customerName?: string;
  variant?: 'default' | 'inline';
}

export default function OverdueCreditAlert({ count, customerName, variant = 'default' }: OverdueCreditAlertProps) {
  if (variant === 'inline') {
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="h-3 w-3" />
        {t('overdue.badge')}
      </Badge>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
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
