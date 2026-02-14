import { useState } from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import { useExchangeRates, useAddExchangeRate } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import LargeButton from '@/components/LargeButton';
import { toast } from 'sonner';

export default function RatesPage() {
  const { data: rates = [], isLoading } = useExchangeRates();
  const addRate = useAddExchangeRate();
  const [formData, setFormData] = useState({
    bcvVesPerUsd: '',
    copPerUsd: '',
  });

  const latestRate = rates[rates.length - 1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addRate.mutateAsync({
        bcvVesPerUsd: parseFloat(formData.bcvVesPerUsd),
        copPerUsd: parseFloat(formData.copPerUsd),
      });
      
      toast.success('Tasa de cambio agregada exitosamente');
      setFormData({ bcvVesPerUsd: '', copPerUsd: '' });
    } catch (error) {
      toast.error('Error al agregar tasa de cambio');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tasas de Cambio</h1>
        <p className="text-muted-foreground">Gestionar tasas de cambio USD a VES y COP</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tasas Actuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : latestRate ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">BCV VES por USD</div>
                  <div className="text-2xl font-bold">
                    {latestRate.bcvVesPerUsd.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">COP por USD</div>
                  <div className="text-2xl font-bold">
                    {latestRate.copPerUsd.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Actualizado: {new Date(Number(latestRate.date) / 1000000).toLocaleString('es-ES', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay tasas de cambio disponibles. Agrega la primera tasa a continuación.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agregar Nueva Tasa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bcvVesPerUsd">BCV VES por USD *</Label>
                <Input
                  id="bcvVesPerUsd"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.bcvVesPerUsd}
                  onChange={(e) => setFormData({ ...formData, bcvVesPerUsd: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="copPerUsd">COP por USD *</Label>
                <Input
                  id="copPerUsd"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.copPerUsd}
                  onChange={(e) => setFormData({ ...formData, copPerUsd: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <LargeButton type="submit" disabled={addRate.isPending} className="w-full">
                <Plus className="mr-2 h-5 w-5" />
                {addRate.isPending ? 'Agregando...' : 'Agregar Tasa'}
              </LargeButton>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Tasas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : rates.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No hay historial de tasas disponible
            </p>
          ) : (
            <div className="space-y-2">
              {[...rates].reverse().map((rate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    {index === 0 && (
                      <Badge>Última</Badge>
                    )}
                    <div>
                      <div className="text-sm font-medium">
                        {new Date(Number(rate.date) / 1000000).toLocaleString('es-ES', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div>
                      <div className="text-xs text-muted-foreground">VES</div>
                      <div className="font-medium">
                        {rate.bcvVesPerUsd.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">COP</div>
                      <div className="font-medium">
                        {rate.copPerUsd.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
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
