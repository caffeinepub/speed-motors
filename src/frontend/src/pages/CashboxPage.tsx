import { useState } from 'react';
import { Wallet, Plus, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { useCashboxEntries, useCashboxTotals, useAddCashboxEntry, useLatestExchangeRate } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import LargeButton from '@/components/LargeButton';
import { formatUSD, convertToVES, convertToCOP, formatVES, formatCOP } from '@/lib/currency';
import { generateId } from '@/lib/utils';
import { toast } from 'sonner';
import { Variant__in_out } from '@/backend';
import { t } from '@/lib/i18n';

export default function CashboxPage() {
  const { data: entries = [], isLoading } = useCashboxEntries();
  const { data: totals } = useCashboxTotals();
  const { data: latestRate } = useLatestExchangeRate();
  const addEntry = useAddCashboxEntry();
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | '_in' | 'out'>('all');
  const [formData, setFormData] = useState({
    entryType: Variant__in_out._in,
    amountUsd: '',
    currency: 'usd',
    description: '',
  });

  const filteredEntries = entries.filter(entry => {
    if (filterType === 'all') return true;
    return entry.entryType === filterType;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => 
    Number(b.timestamp) - Number(a.timestamp)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addEntry.mutateAsync({
        id: generateId(),
        entryType: formData.entryType,
        amountUsd: parseFloat(formData.amountUsd),
        currency: formData.currency,
        description: formData.description,
      });
      
      toast.success(t('cashbox.success'));
      setShowForm(false);
      setFormData({
        entryType: Variant__in_out._in,
        amountUsd: '',
        currency: 'usd',
        description: '',
      });
    } catch (error) {
      toast.error(t('cashbox.error'));
      console.error(error);
    }
  };

  let runningBalance = 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('cashbox.title')}</h1>
          <p className="text-muted-foreground">{t('cashbox.subtitle')}</p>
        </div>
        <LargeButton onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-5 w-5" />
          {t('cashbox.add_entry')}
        </LargeButton>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">USD</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatUSD(totals?.usd || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">VES</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestRate ? formatVES(convertToVES(totals?.ves || 0, latestRate)) : formatUSD(totals?.ves || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">COP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestRate ? formatCOP(convertToCOP(totals?.cop || 0, latestRate)) : formatUSD(totals?.cop || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            filterType === 'all'
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card hover:bg-muted'
          }`}
        >
          <Filter className="h-4 w-4" />
          {t('cashbox.filter_all')}
        </button>
        <button
          onClick={() => setFilterType('_in')}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            filterType === '_in'
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card hover:bg-muted'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          {t('cashbox.filter_in')}
        </button>
        <button
          onClick={() => setFilterType('out')}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            filterType === 'out'
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card hover:bg-muted'
          }`}
        >
          <TrendingDown className="h-4 w-4" />
          {t('cashbox.filter_out')}
        </button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : sortedEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">{t('cashbox.no_entries')}</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {t('cashbox.start_adding')}
              </p>
              <LargeButton onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-5 w-5" />
                {t('cashbox.add_entry')}
              </LargeButton>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{t('cashbox.type')}</TableHead>
                    <TableHead>{t('cashbox.date')}</TableHead>
                    <TableHead>{t('cashbox.currency')}</TableHead>
                    <TableHead className="text-right">{t('cashbox.amount')}</TableHead>
                    <TableHead>{t('cashbox.description')}</TableHead>
                    <TableHead className="text-right">{t('cashbox.balance')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedEntries.map((entry) => {
                    const amount = entry.entryType === '_in' ? entry.amountUsd : -entry.amountUsd;
                    runningBalance += amount;
                    
                    return (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.id}</TableCell>
                        <TableCell>
                          {entry.entryType === '_in' ? (
                            <Badge className="gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {t('cashbox.entry_in')}
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1">
                              <TrendingDown className="h-3 w-3" />
                              {t('cashbox.entry_out')}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(Number(entry.timestamp) / 1000000).toLocaleString('es-ES')}
                        </TableCell>
                        <TableCell className="uppercase">{entry.currency}</TableCell>
                        <TableCell className={`text-right font-medium ${entry.entryType === '_in' ? 'text-green-600' : 'text-destructive'}`}>
                          {entry.entryType === '_in' ? '+' : '-'}{formatUSD(entry.amountUsd)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{entry.description}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatUSD(runningBalance)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('cashbox.add_new_entry')}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entryType">{t('cashbox.entry_type')} *</Label>
              <Select
                value={formData.entryType}
                onValueChange={(value) => setFormData({ ...formData, entryType: value as Variant__in_out })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Variant__in_out._in}>{t('cashbox.entry_in')}</SelectItem>
                  <SelectItem value={Variant__in_out.out}>{t('cashbox.entry_out')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">{t('cashbox.currency')} *</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="ves">VES</SelectItem>
                  <SelectItem value="cop">COP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amountUsd">{t('cashbox.amount_usd')} *</Label>
              <Input
                id="amountUsd"
                type="number"
                step="0.01"
                min="0"
                value={formData.amountUsd}
                onChange={(e) => setFormData({ ...formData, amountUsd: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('cashbox.description')} *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('cashbox.description_placeholder')}
                required
              />
            </div>

            <DialogFooter>
              <LargeButton type="button" variant="outline" onClick={() => setShowForm(false)}>
                {t('action.cancel')}
              </LargeButton>
              <LargeButton type="submit" disabled={addEntry.isPending}>
                {addEntry.isPending ? t('cashbox.adding') : t('action.add')}
              </LargeButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
