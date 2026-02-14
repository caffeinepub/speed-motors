import { useState } from 'react';
import { useCreateInventoryItem } from '@/hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import LargeButton from '@/components/LargeButton';
import { generateId } from '@/lib/utils';
import { toast } from 'sonner';

interface InventoryItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InventoryItemForm({ open, onOpenChange }: InventoryItemFormProps) {
  const createItem = useCreateInventoryItem();
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    stockCurrent: '',
    stockMin: '',
    costUsd: '',
    sellRetailUsd: '',
    sellWholesaleUsd: '',
    sellSpecialUsd: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createItem.mutateAsync({
        id: generateId(),
        photo: null,
        description: formData.description,
        category: formData.category,
        stockCurrent: BigInt(formData.stockCurrent || 0),
        stockMin: BigInt(formData.stockMin || 0),
        costUsd: parseFloat(formData.costUsd || '0'),
        sellRetailUsd: parseFloat(formData.sellRetailUsd || '0'),
        sellWholesaleUsd: parseFloat(formData.sellWholesaleUsd || '0'),
        sellSpecialUsd: parseFloat(formData.sellSpecialUsd || '0'),
      });
      
      toast.success('Producto agregado exitosamente');
      onOpenChange(false);
      setFormData({
        description: '',
        category: '',
        stockCurrent: '',
        stockMin: '',
        costUsd: '',
        sellRetailUsd: '',
        sellWholesaleUsd: '',
        sellSpecialUsd: '',
      });
    } catch (error) {
      toast.error('Error al agregar producto');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Producto</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ej: Filtro de aceite"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ej: Filtros"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockCurrent">Stock Actual *</Label>
              <Input
                id="stockCurrent"
                type="number"
                min="0"
                value={formData.stockCurrent}
                onChange={(e) => setFormData({ ...formData, stockCurrent: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockMin">Stock Mínimo *</Label>
              <Input
                id="stockMin"
                type="number"
                min="0"
                value={formData.stockMin}
                onChange={(e) => setFormData({ ...formData, stockMin: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costUsd">Costo (USD) *</Label>
              <Input
                id="costUsd"
                type="number"
                step="0.01"
                min="0"
                value={formData.costUsd}
                onChange={(e) => setFormData({ ...formData, costUsd: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellRetailUsd">Precio Detal (USD) *</Label>
              <Input
                id="sellRetailUsd"
                type="number"
                step="0.01"
                min="0"
                value={formData.sellRetailUsd}
                onChange={(e) => setFormData({ ...formData, sellRetailUsd: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellWholesaleUsd">Precio Mayor (USD) *</Label>
              <Input
                id="sellWholesaleUsd"
                type="number"
                step="0.01"
                min="0"
                value={formData.sellWholesaleUsd}
                onChange={(e) => setFormData({ ...formData, sellWholesaleUsd: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellSpecialUsd">Precio Especial (USD) *</Label>
              <Input
                id="sellSpecialUsd"
                type="number"
                step="0.01"
                min="0"
                value={formData.sellSpecialUsd}
                onChange={(e) => setFormData({ ...formData, sellSpecialUsd: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <LargeButton type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </LargeButton>
            <LargeButton type="submit" disabled={createItem.isPending}>
              {createItem.isPending ? 'Agregando...' : 'Agregar'}
            </LargeButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
