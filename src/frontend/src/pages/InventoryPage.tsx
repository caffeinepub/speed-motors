import { useState } from 'react';
import { Plus, AlertTriangle, Package } from 'lucide-react';
import { useInventory, useLatestExchangeRate } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import LargeButton from '@/components/LargeButton';
import InventoryItemForm from '@/components/inventory/InventoryItemForm';
import { formatUSD, convertToVES, convertToCOP, formatVES, formatCOP } from '@/lib/currency';
import { cn } from '@/lib/utils';

export default function InventoryPage() {
  const { data: inventory = [], isLoading } = useInventory();
  const { data: latestRate } = useLatestExchangeRate();
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(inventory.map((item) => item.category)))];
  
  const filteredInventory = selectedCategory === 'all' 
    ? inventory 
    : inventory.filter((item) => item.category === selectedCategory);

  const lowStockItems = inventory.filter((item) => item.stockCurrent <= item.stockMin);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventario</h1>
          <p className="text-muted-foreground">Gestionar repuestos de motos y niveles de stock</p>
        </div>
        <LargeButton onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-5 w-5" />
          Agregar Producto
        </LargeButton>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Alerta de Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {lowStockItems.length} producto{lowStockItems.length !== 1 ? 's' : ''} en o por debajo del nivel mínimo de stock
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
              selectedCategory === category
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card hover:bg-muted'
            )}
          >
            {category === 'all' ? 'Todas las Categorías' : category}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No se encontraron productos</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {selectedCategory === 'all' 
                  ? 'Comienza agregando tu primer producto'
                  : 'No hay productos en esta categoría'}
              </p>
              {selectedCategory === 'all' && (
                <LargeButton onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-5 w-5" />
                  Agregar Producto
                </LargeButton>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Stock Mín</TableHead>
                    <TableHead className="text-right">Costo (USD)</TableHead>
                    <TableHead className="text-right">Detal (USD)</TableHead>
                    <TableHead className="text-right">Mayor (USD)</TableHead>
                    <TableHead className="text-right">Especial (USD)</TableHead>
                    {latestRate && (
                      <>
                        <TableHead className="text-right">Detal (VES)</TableHead>
                        <TableHead className="text-right">Detal (COP)</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const isLowStock = item.stockCurrent <= item.stockMin;
                    return (
                      <TableRow key={item.id} className={cn(isLowStock && 'bg-destructive/5')}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.description}
                            {isLowStock && (
                              <Badge variant="destructive" className="ml-2">
                                Stock Bajo
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell className={cn('text-right font-medium', isLowStock && 'text-destructive')}>
                          {Number(item.stockCurrent)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {Number(item.stockMin)}
                        </TableCell>
                        <TableCell className="text-right">{formatUSD(item.costUsd)}</TableCell>
                        <TableCell className="text-right font-medium">{formatUSD(item.sellRetailUsd)}</TableCell>
                        <TableCell className="text-right">{formatUSD(item.sellWholesaleUsd)}</TableCell>
                        <TableCell className="text-right">{formatUSD(item.sellSpecialUsd)}</TableCell>
                        {latestRate && (
                          <>
                            <TableCell className="text-right text-muted-foreground">
                              {formatVES(convertToVES(item.sellRetailUsd, latestRate))}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {formatCOP(convertToCOP(item.sellRetailUsd, latestRate))}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <InventoryItemForm open={showForm} onOpenChange={setShowForm} />
    </div>
  );
}
