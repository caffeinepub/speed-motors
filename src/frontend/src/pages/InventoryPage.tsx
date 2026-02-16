import { useState } from 'react';
import { Plus, AlertTriangle, Package, Edit } from 'lucide-react';
import { useInventory, useLatestExchangeRate } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import LargeButton from '@/components/LargeButton';
import InventoryItemForm from '@/components/inventory/InventoryItemForm';
import { formatUSD, convertToVES, convertToCOP, formatVES, formatCOP } from '@/lib/currency';
import { cn } from '@/lib/utils';
import type { InventoryItem } from '@/backend';
import { t } from '@/lib/i18n';

export default function InventoryPage() {
  const { data: inventory = [], isLoading } = useInventory();
  const { data: latestRate } = useLatestExchangeRate();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(inventory.map((item) => item.category)))];
  
  const filteredInventory = selectedCategory === 'all' 
    ? inventory 
    : inventory.filter((item) => item.category === selectedCategory);

  const lowStockItems = inventory.filter((item) => item.stockCurrent <= item.stockMin);

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(undefined);
  };

  const handleAddNew = () => {
    setEditingItem(undefined);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('inventory.title')}</h1>
          <p className="text-muted-foreground">{t('inventory.subtitle')}</p>
        </div>
        <LargeButton onClick={handleAddNew}>
          <Plus className="mr-2 h-5 w-5" />
          {t('inventory.add_product')}
        </LargeButton>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t('inventory.low_stock_alert')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {lowStockItems.length} {lowStockItems.length === 1 
                ? t('inventory.low_stock_description')
                : t('inventory.low_stock_description_plural')}
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
            {category === 'all' ? t('inventory.all_categories') : category}
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
              <h3 className="mb-2 text-lg font-semibold">{t('inventory.no_products')}</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {selectedCategory === 'all' 
                  ? t('inventory.start_adding')
                  : t('inventory.no_products_category')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('table.id')}</TableHead>
                    <TableHead>{t('table.description')}</TableHead>
                    <TableHead>{t('table.category')}</TableHead>
                    <TableHead className="text-right">{t('table.stock')}</TableHead>
                    <TableHead className="text-right">{t('table.stock_min')}</TableHead>
                    <TableHead className="text-right">{t('table.cost_usd')}</TableHead>
                    <TableHead className="text-right">{t('table.retail_usd')}</TableHead>
                    <TableHead className="text-right">{t('table.retail_ves')}</TableHead>
                    <TableHead className="text-right">{t('table.retail_cop')}</TableHead>
                    <TableHead className="text-right">{t('action.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const isLowStock = item.stockCurrent <= item.stockMin;
                    const vesPrice = convertToVES(item.sellRetailUsd, latestRate ?? null);
                    const copPrice = convertToCOP(item.sellRetailUsd, latestRate ?? null);

                    return (
                      <TableRow key={item.id} className={cn(isLowStock && 'bg-destructive/5')}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {item.id}
                            {isLowStock && (
                              <Badge variant="destructive" className="text-xs">
                                {t('inventory.low_stock_badge')}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.description || (
                            <span className="text-muted-foreground">{t('inventory.no_description')}</span>
                          )}
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">{item.stockCurrent.toString()}</TableCell>
                        <TableCell className="text-right">{item.stockMin.toString()}</TableCell>
                        <TableCell className="text-right">{formatUSD(item.costUsd)}</TableCell>
                        <TableCell className="text-right">{formatUSD(item.sellRetailUsd)}</TableCell>
                        <TableCell className="text-right">{formatVES(vesPrice)}</TableCell>
                        <TableCell className="text-right">{formatCOP(copPrice)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            {t('action.edit')}
                          </Button>
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

      <InventoryItemForm
        open={showForm}
        onOpenChange={handleCloseForm}
        mode={editingItem ? 'edit' : 'create'}
        initialItem={editingItem}
      />
    </div>
  );
}
