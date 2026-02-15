import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useCustomers, useCreateCustomer, useOverdueDelinquentSales } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import LargeButton from '@/components/LargeButton';
import { Badge } from '@/components/ui/badge';
import OverdueCreditAlert from '@/components/customers/OverdueCreditAlert';
import { formatUSD } from '@/lib/currency';
import { generateId } from '@/lib/utils';
import { toast } from 'sonner';

export default function CustomersPage() {
  const { data: customers = [], isLoading } = useCustomers();
  const { data: overdueSales = [] } = useOverdueDelinquentSales();
  const createCustomer = useCreateCustomer();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
  });

  const overdueCustomerNames = new Set(overdueSales.map(sale => sale.customerName));
  const overdueCount = overdueCustomerNames.size;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createCustomer.mutateAsync({
        id: generateId(),
        name: formData.name,
        contactInfo: formData.contactInfo,
      });
      
      toast.success('Cliente agregado exitosamente');
      setShowForm(false);
      setFormData({ name: '', contactInfo: '' });
    } catch (error) {
      toast.error('Error al agregar cliente');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gestionar información de clientes y deudas</p>
        </div>
        <LargeButton onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-5 w-5" />
          Agregar Cliente
        </LargeButton>
      </div>

      {overdueCount > 0 && (
        <OverdueCreditAlert count={overdueCount} />
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No se encontraron clientes</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Comienza agregando tu primer cliente
              </p>
              <LargeButton onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-5 w-5" />
                Agregar Cliente
              </LargeButton>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead className="text-right">Deuda (USD)</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => {
                    const hasOverdue = overdueCustomerNames.has(customer.name);
                    return (
                      <TableRow 
                        key={customer.id}
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => navigate({ to: `/customers/${customer.id}` })}
                      >
                        <TableCell className="font-medium">{customer.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {customer.name}
                            {hasOverdue && <OverdueCreditAlert variant="inline" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{customer.contactInfo}</TableCell>
                        <TableCell className="text-right">
                          <span className={customer.debtUsd > 0 ? 'font-medium text-destructive' : ''}>
                            {formatUSD(customer.debtUsd)}
                          </span>
                          {customer.debtUsd > 0 && (
                            <Badge variant="destructive" className="ml-2">Deuda</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <LargeButton variant="outline" size="sm">
                            Ver Detalles
                          </LargeButton>
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
            <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Información de Contacto *</Label>
              <Input
                id="contactInfo"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                placeholder="Teléfono, email o dirección"
                required
              />
            </div>

            <DialogFooter>
              <LargeButton type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </LargeButton>
              <LargeButton type="submit" disabled={createCustomer.isPending}>
                {createCustomer.isPending ? 'Agregando...' : 'Agregar Cliente'}
              </LargeButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
