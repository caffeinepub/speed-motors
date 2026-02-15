import { useState } from 'react';
import { FileText, Plus, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useClosures, useCreateClosure, useCashboxEntries, useCashboxTotals } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import LargeButton from '@/components/LargeButton';
import { generateId } from '@/lib/utils';
import { toast } from 'sonner';
import { t } from '@/lib/i18n';
import type { CashboxEntry } from '@/backend';
import { Variant__in_out } from '@/backend';

export default function ClosuresPage() {
  const { data: closures = [], isLoading: closuresLoading } = useClosures();
  const { data: cashboxEntries = [] } = useCashboxEntries();
  const { data: cashboxTotals } = useCashboxTotals();
  const createClosure = useCreateClosure();
  const { identity } = useInternetIdentity();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    openingBalanceUsd: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error(t('closures.login_required'));
      return;
    }

    try {
      const openingBalance = parseFloat(formData.openingBalanceUsd);
      const closingBalance = cashboxTotals?.usd || 0;

      // Calculate income and expenses from cashbox entries
      let totalIncome = 0;
      let totalExpenses = 0;

      cashboxEntries.forEach((entry: CashboxEntry) => {
        const entryType = entry.entryType as Variant__in_out;
        if (entryType === Variant__in_out._in) {
          totalIncome += entry.amountUsd;
        } else {
          totalExpenses += entry.amountUsd;
        }
      });

      await createClosure.mutateAsync({
        id: generateId(),
        openingBalanceUsd: openingBalance,
        closingBalanceUsd: closingBalance,
        totalIncomeUsd: totalIncome,
        totalExpensesUsd: totalExpenses,
        cashboxEntries: cashboxEntries,
        createdBy: identity.getPrincipal().toString(),
      });

      toast.success(t('closures.success'));
      setFormData({ openingBalanceUsd: '' });
      setDialogOpen(false);
    } catch (error) {
      toast.error(t('closures.error'));
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('closures.title')}</h1>
          <p className="text-muted-foreground">{t('closures.subtitle')}</p>
        </div>
        <LargeButton onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-5 w-5" />
          {t('closures.create_closure')}
        </LargeButton>
      </div>

      {cashboxTotals && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {t('closures.current_cashbox')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">USD</p>
                <p className="text-2xl font-bold">${cashboxTotals.usd.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">VES</p>
                <p className="text-2xl font-bold">${cashboxTotals.ves.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">COP</p>
                <p className="text-2xl font-bold">${cashboxTotals.cop.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('closures.history')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {closuresLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : closures.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t('closures.no_closures')}</p>
              <p className="text-sm text-muted-foreground">{t('closures.start_adding')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...closures].reverse().map((closure) => (
                <Card key={closure.id}>
                  <CardContent className="pt-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(Number(closure.createdAt) / 1000000).toLocaleString('es-ES')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t('closures.created_by')}: {closure.createdBy.slice(0, 8)}...
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{t('closures.entries')}</p>
                        <p className="text-sm font-medium">{closure.cashboxEntries.length}</p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs text-muted-foreground">{t('closures.opening_balance')}</p>
                        <p className="text-lg font-semibold">${closure.openingBalanceUsd.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t('closures.closing_balance')}</p>
                        <p className="text-lg font-semibold">${closure.closingBalanceUsd.toFixed(2)}</p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">{t('closures.total_income')}</p>
                          <p className="font-medium text-green-600">${closure.totalIncomeUsd.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">{t('closures.total_expenses')}</p>
                          <p className="font-medium text-red-600">${closure.totalExpensesUsd.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <p className="text-xs text-muted-foreground">{t('closures.net_change')}</p>
                      <p className={`text-xl font-bold ${
                        (closure.closingBalanceUsd - closure.openingBalanceUsd) >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        ${(closure.closingBalanceUsd - closure.openingBalanceUsd).toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('closures.create_new')}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openingBalanceUsd">{t('closures.opening_balance')} (USD) *</Label>
              <Input
                id="openingBalanceUsd"
                type="number"
                step="0.01"
                value={formData.openingBalanceUsd}
                onChange={(e) => setFormData({ ...formData, openingBalanceUsd: e.target.value })}
                placeholder="0.00"
                required
              />
              <p className="text-xs text-muted-foreground">
                {t('closures.opening_balance_help')}
              </p>
            </div>

            {cashboxTotals && (
              <div className="rounded-lg bg-muted p-4">
                <p className="mb-2 text-sm font-medium">{t('closures.current_totals')}</p>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">USD:</span>
                    <span className="font-medium">${cashboxTotals.usd.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VES:</span>
                    <span className="font-medium">${cashboxTotals.ves.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">COP:</span>
                    <span className="font-medium">${cashboxTotals.cop.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <LargeButton type="submit" disabled={createClosure.isPending}>
                {createClosure.isPending ? t('closures.creating') : t('closures.create')}
              </LargeButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
