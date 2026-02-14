import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ventas</h1>
        <p className="text-muted-foreground">Registrar y gestionar transacciones de ventas</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Integración de Backend Requerida</AlertTitle>
        <AlertDescription>
          El registro de ventas requiere métodos en el backend para crear ventas, actualizar stock de inventario, 
          gestionar deuda de clientes y crear entradas de caja. Estas funcionalidades estarán disponibles 
          una vez que se extienda el backend con las entidades Sale y CashEntry.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Módulo de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Este módulo te permitirá:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Seleccionar cliente y productos</li>
            <li>Elegir nivel de precio (Detal, Mayor, Especial)</li>
            <li>Seleccionar método de pago (Efectivo, Transferencia, Crédito)</li>
            <li>Ver totales en USD, VES y COP</li>
            <li>Actualizar automáticamente inventario y caja</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
