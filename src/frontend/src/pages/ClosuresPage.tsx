import { AlertCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ClosuresPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cierres</h1>
        <p className="text-muted-foreground">Generar y ver resúmenes de períodos</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Integración de Backend Requerida</AlertTitle>
        <AlertDescription>
          Los reportes de cierre requieren métodos en el backend para agregar ventas, movimientos de caja, 
          deuda de clientes y cuentas por pagar a proveedores por período (diario/quincenal/mensual). 
          Estas funcionalidades estarán disponibles una vez que se extienda el backend.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Módulo de Cierres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Este módulo te permitirá:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Generar resúmenes diarios, quincenales y mensuales</li>
            <li>Ver total de ventas pagadas vs ventas a crédito</li>
            <li>Ver totales de Entrada/Salida de caja y balance neto</li>
            <li>Seguimiento de deuda pendiente de clientes</li>
            <li>Monitorear cuentas por pagar a proveedores</li>
            <li>Navegar cierres históricos por rango de fechas</li>
            <li>Ver montos en USD con equivalentes en VES/COP</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
