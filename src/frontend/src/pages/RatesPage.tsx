import { useState } from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import { useExchangeRates, useAddExchangeRate } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import LargeButton from '@/components/LargeButton';
import { extractErrorMessage } from '@/lib/errorMessage';
import { toast } from 'sonner';
import { t } from '@/lib/i18n';

export default function RatesPage() {
  const { identity } = useInternetIdentity();
  const { data: rates = [], isLoading } = useExchangeRates();
  const addRate = useAddExchangeRate();
  const [formData, setFormData] = useState({
    bcvVesPerUsd: '',
    copPerUsd: '',
  });

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const latestRate = rates[rates.length - 1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check authentication first
    if (!isAuthenticated) {
      toast.error('Please sign in to continue');
      return;
    }

    try {
      await addRate.mutateAsync({
        bcvVesPerUsd: parseFloat(formData.bcvVesPerUsd),
        copPerUsd: parseFloat(formData.copPerUsd),
      });
      
      toast.success(t('rates.success'));
      setFormData({ bcvVesPerUsd: '', copPerUsd: '' });
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      toast.error(`${t('rates.error')}${errorMsg ? ': ' + errorMsg : ''}`);
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('rates.title')}</h1>
        <p className="text-muted-foreground">{t('rates.subtitle')}</p>
      </div>

      {latestRate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t('rates.current_rate')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">{t('rates.bcv_ves')}</p>
                <p className="text-2xl font-bold">{latestRate.bcvVesPerUsd.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('rates.cop')}</p>
                <p className="text-2xl font-bold">{latestRate.copPerUsd.toFixed(2)}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {new Date(Number(latestRate.date) / 1000000).toLocaleString('es-ES')}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('rates.add_new_rate')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bcvVesPerUsd">{t('rates.bcv_ves')}</Label>
                <Input
                  id="bcvVesPerUsd"
                  type="number"
                  step="0.01"
                  value={formData.bcvVesPerUsd}
                  onChange={(e) => setFormData({ ...formData, bcvVesPerUsd: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="copPerUsd">{t('rates.cop')}</Label>
                <Input
                  id="copPerUsd"
                  type="number"
                  step="0.01"
                  value={formData.copPerUsd}
                  onChange={(e) => setFormData({ ...formData, copPerUsd: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {!isAuthenticated && (
              <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                Please sign in to add exchange rates
              </div>
            )}

            <LargeButton
              type="submit"
              disabled={!isAuthenticated || addRate.isPending}
              className="w-full"
            >
              <Plus className="mr-2 h-5 w-5" />
              {addRate.isPending ? t('rates.adding') : t('rates.add_rate')}
            </LargeButton>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('rates.history')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : rates.length === 0 ? (
            <p className="text-center text-muted-foreground">{t('rates.no_rates')}</p>
          ) : (
            <div className="space-y-2">
              {rates.slice().reverse().map((rate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t('rates.bcv_ves')}:</span>
                      <span>{rate.bcvVesPerUsd.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t('rates.cop')}:</span>
                      <span>{rate.copPerUsd.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(Number(rate.date) / 1000000).toLocaleDateString('es-ES')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(Number(rate.date) / 1000000).toLocaleTimeString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
