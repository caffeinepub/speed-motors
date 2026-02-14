import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CashboxPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Caja</h1>
        <p className="text-muted-foreground">Seguimiento de movimientos de efectivo y balance</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Integración de Backend Requerida</AlertTitle>
        <AlertDescription>
          La gestión de caja requiere métodos en el backend para crear y listar entradas de efectivo (Entrada/Salida), 
          seguimiento de balance corriente y filtrado por rango de fechas. Estas funcionalidades estarán disponibles 
          una vez que se extienda el backend con la entidad CashEntry.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Módulo de Caja</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Este módulo te permitirá:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Ver todas las entradas de efectivo (Entrada/Salida)</li>
            <li>Filtrar por rango de fechas y tipo</li>
            <li>Ver balance corriente y totales</li>
            <li>Agregar entradas manuales de efectivo para gastos</li>
            <li>Seguimiento de entradas generadas por el sistema desde ventas y pagos</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
