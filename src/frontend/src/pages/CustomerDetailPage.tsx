import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useCustomer, useDelinquentSales } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import LargeButton from '@/components/LargeButton';
import OverdueCreditAlert from '@/components/customers/OverdueCreditAlert';
import { formatUSD } from '@/lib/currency';
import { t } from '@/lib/i18n';

export default function CustomerDetailPage() {
  const { customerId } = useParams({ from: '/customers/$customerId' });
  const navigate = useNavigate();
  const { data: customer, isLoading } = useCustomer(customerId);
  const { data: overdueSales = [] } = useDelinquentSales();

  const customerOverdueSales = customer 
    ? overdueSales.filter(sale => sale.customerName === customer.name)
    : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('customer_detail.not_found')}</AlertTitle>
          <AlertDescription>{t('customer_detail.not_found_description')}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <LargeButton variant="outline" onClick={() => navigate({ to: '/customers' })}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          {t('action.back')}
        </LargeButton>
        <div>
          <h1 className="text-3xl font-bold">{customer.name}</h1>
          <p className="text-muted-foreground">{customer.contactInfo}</p>
        </div>
      </div>

      {customerOverdueSales.length > 0 && (
        <OverdueCreditAlert customerName={customer.name} />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('customer_detail.current_debt')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${customer.debtUsd > 0 ? 'text-destructive' : ''}`}>
              {formatUSD(customer.debtUsd)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('customer_detail.customer_id')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-mono">{customer.id}</div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('customer_detail.backend_required')}</AlertTitle>
        <AlertDescription>
          {t('customer_detail.backend_description')}
        </AlertDescription>
      </Alert>
    </div>
  );
}
