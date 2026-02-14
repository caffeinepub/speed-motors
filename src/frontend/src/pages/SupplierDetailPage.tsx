import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import LargeButton from '@/components/LargeButton';

export default function SupplierDetailPage() {
  const { supplierId } = useParams({ from: '/suppliers/$supplierId' });
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <LargeButton variant="outline" onClick={() => navigate({ to: '/suppliers' })}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          Atrás
        </LargeButton>
        <div>
          <h1 className="text-3xl font-bold">Detalles del Proveedor</h1>
          <p className="text-muted-foreground">ID: {supplierId}</p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Integración de Backend Requerida</AlertTitle>
        <AlertDescription>
          Los detalles del proveedor, historial de entradas de stock y seguimiento de pagos requieren 
          métodos adicionales en el backend. Estas funcionalidades estarán disponibles una vez que se 
          extienda el backend.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Información del Proveedor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Los detalles del proveedor se mostrarán aquí una vez que se complete la integración de backend.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
