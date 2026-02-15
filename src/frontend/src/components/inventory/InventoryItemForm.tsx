import { useState, useEffect } from 'react';
import { useCreateInventoryItem, useUpdateInventoryItem } from '@/hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LargeButton from '@/components/LargeButton';
import { generateId } from '@/lib/utils';
import { calculatePriceWithMargin } from '@/lib/inventoryPricing';
import { fileToBytes, bytesToImageUrl } from '@/lib/fileToBytes';
import { toast } from 'sonner';
import type { InventoryItem } from '@/backend';
import { Upload, X } from 'lucide-react';
import { t } from '@/lib/i18n';

interface InventoryItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  initialItem?: InventoryItem;
}

export default function InventoryItemForm({ open, onOpenChange, mode = 'create', initialItem }: InventoryItemFormProps) {
  const createItem = useCreateInventoryItem();
  const updateItem = useUpdateInventoryItem();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    description: '',
    category: '',
    profitMarginPercent: '',
    stockCurrent: '',
    stockMin: '',
    costUsd: '',
    sellRetailUsd: '',
    sellWholesaleUsd: '',
    sellSpecialUsd: '',
  });

  useEffect(() => {
    if (mode === 'edit' && initialItem) {
      setFormData({
        description: initialItem.description,
        category: initialItem.category,
        profitMarginPercent: initialItem.profitMarginPercent.toString(),
        stockCurrent: initialItem.stockCurrent.toString(),
        stockMin: initialItem.stockMin.toString(),
        costUsd: initialItem.costUsd.toString(),
        sellRetailUsd: initialItem.sellRetailUsd.toString(),
        sellWholesaleUsd: initialItem.sellWholesaleUsd.toString(),
        sellSpecialUsd: initialItem.sellSpecialUsd.toString(),
      });
      
      if (initialItem.photo) {
        setImagePreview(bytesToImageUrl(initialItem.photo));
      }
    } else {
      resetForm();
    }
  }, [mode, initialItem, open]);

  const resetForm = () => {
    setFormData({
      description: '',
      category: '',
      profitMarginPercent: '',
      stockCurrent: '',
      stockMin: '',
      costUsd: '',
      sellRetailUsd: '',
      sellWholesaleUsd: '',
      sellSpecialUsd: '',
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleCostOrMarginChange = (field: 'costUsd' | 'profitMarginPercent', value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    const cost = parseFloat(field === 'costUsd' ? value : formData.costUsd);
    const margin = parseFloat(field === 'profitMarginPercent' ? value : formData.profitMarginPercent);

    if (!isNaN(cost) && !isNaN(margin) && cost > 0 && margin >= 0) {
      const calculatedPrice = calculatePriceWithMargin(cost, margin);
      setFormData(prev => ({
        ...prev,
        sellRetailUsd: calculatedPrice.toString(),
        sellSpecialUsd: calculatedPrice.toString(),
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const photoBytes = await fileToBytes(imageFile);
      
      if (mode === 'edit' && initialItem) {
        await updateItem.mutateAsync({
          id: initialItem.id,
          payload: {
            description: formData.description || undefined,
            category: formData.category || undefined,
            profitMarginPercent: formData.profitMarginPercent ? parseFloat(formData.profitMarginPercent) : undefined,
            stockCurrent: formData.stockCurrent ? BigInt(formData.stockCurrent) : undefined,
            stockMin: formData.stockMin ? BigInt(formData.stockMin) : undefined,
            costUsd: formData.costUsd ? parseFloat(formData.costUsd) : undefined,
            sellRetailUsd: formData.sellRetailUsd ? parseFloat(formData.sellRetailUsd) : undefined,
            sellWholesaleUsd: formData.sellWholesaleUsd ? parseFloat(formData.sellWholesaleUsd) : undefined,
            sellSpecialUsd: formData.sellSpecialUsd ? parseFloat(formData.sellSpecialUsd) : undefined,
            photo: photoBytes || undefined,
          },
        });
        toast.success(t('inventory_form.success_update'));
      } else {
        await createItem.mutateAsync({
          id: generateId(),
          photo: photoBytes,
          description: formData.description,
          category: formData.category,
          profitMarginPercent: parseFloat(formData.profitMarginPercent || '0'),
          stockCurrent: BigInt(formData.stockCurrent || 0),
          stockMin: BigInt(formData.stockMin || 0),
          costUsd: parseFloat(formData.costUsd || '0'),
          sellRetailUsd: parseFloat(formData.sellRetailUsd || '0'),
          sellWholesaleUsd: parseFloat(formData.sellWholesaleUsd || '0'),
          sellSpecialUsd: parseFloat(formData.sellSpecialUsd || '0'),
        });
        toast.success(t('inventory_form.success_create'));
      }
      
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error(mode === 'edit' ? t('inventory_form.error_update') : t('inventory_form.error_create'));
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? t('inventory_form.edit_title') : t('inventory_form.create_title')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">{t('inventory_form.description')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t('inventory_form.description_placeholder')}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">{t('inventory_form.photo')}</Label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="h-32 w-32 rounded-lg object-cover border" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Label
                  htmlFor="photo"
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm hover:bg-accent"
                >
                  <Upload className="h-4 w-4" />
                  {t('inventory_form.upload_image')}
                </Label>
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">{t('inventory_form.category')} *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder={t('inventory_form.category_placeholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profitMarginPercent">{t('inventory_form.profit_margin')} *</Label>
              <Input
                id="profitMarginPercent"
                type="number"
                step="0.01"
                min="0"
                value={formData.profitMarginPercent}
                onChange={(e) => handleCostOrMarginChange('profitMarginPercent', e.target.value)}
                placeholder={t('inventory_form.profit_margin_placeholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockCurrent">{t('inventory_form.stock_current')} *</Label>
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
              <Label htmlFor="stockMin">{t('inventory_form.stock_min')} *</Label>
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
              <Label htmlFor="costUsd">{t('inventory_form.cost_usd')} *</Label>
              <Input
                id="costUsd"
                type="number"
                step="0.01"
                min="0"
                value={formData.costUsd}
                onChange={(e) => handleCostOrMarginChange('costUsd', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellRetailUsd">{t('inventory_form.sell_retail_usd')} *</Label>
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
              <Label htmlFor="sellWholesaleUsd">{t('inventory_form.sell_wholesale_usd')} *</Label>
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
              <Label htmlFor="sellSpecialUsd">{t('inventory_form.sell_special_usd')} *</Label>
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
              {t('action.cancel')}
            </LargeButton>
            <LargeButton type="submit" disabled={createItem.isPending || updateItem.isPending}>
              {createItem.isPending || updateItem.isPending 
                ? (mode === 'edit' ? t('inventory_form.updating') : t('inventory_form.adding')) 
                : (mode === 'edit' ? t('inventory_form.update') : t('inventory_form.add'))}
            </LargeButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
