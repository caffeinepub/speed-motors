import { AlertCircle, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Proveedores</h1>
        <p className="text-muted-foreground">Gestionar proveedores y stock entrante</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Integración de Backend Requerida</AlertTitle>
        <AlertDescription>
          La gestión de proveedores requiere métodos en el backend para crear proveedores, registrar entradas de stock, 
          seguimiento de balances por pagar y actualización de inventario. Estas funcionalidades estarán disponibles 
          una vez que se extienda el backend con las entidades Supplier y SupplierStockEntry.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Módulo de Proveedores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Este módulo te permitirá:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Agregar y gestionar información de proveedores</li>
            <li>Registrar mercancía entrante con líneas de artículos</li>
            <li>Marcar entradas como Pagado o Por Pagar</li>
            <li>Seguimiento de balances por pagar por proveedor</li>
            <li>Actualizar automáticamente stock de inventario</li>
            <li>Crear entradas de Salida de caja para stock pagado</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
