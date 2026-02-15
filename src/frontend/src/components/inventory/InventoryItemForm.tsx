import { useState, useEffect } from 'react';
import { useCreateInventoryItem, useUpdateInventoryItem } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LargeButton from '@/components/LargeButton';
import { Button } from '@/components/ui/button';
import { generateId } from '@/lib/utils';
import { calculatePriceWithMargin } from '@/lib/inventoryPricing';
import { fileToBytes, bytesToImageUrl } from '@/lib/fileToBytes';
import { extractErrorMessage } from '@/lib/errorMessage';
import { toast } from 'sonner';
import type { InventoryItem } from '@/backend';
import { Upload, X, LogIn, AlertCircle } from 'lucide-react';
import { t } from '@/lib/i18n';

interface InventoryItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  initialItem?: InventoryItem;
}

export default function InventoryItemForm({ open, onOpenChange, mode = 'create', initialItem }: InventoryItemFormProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
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

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const isLoggingIn = loginStatus === 'logging-in';

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

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSignIn = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(t('auth.sign_in_error'));
    }
  };

  // Client-side validation
  const validateForm = (): string | null => {
    // Validate text fields
    const trimmedDescription = formData.description.trim();
    const trimmedCategory = formData.category.trim();

    if (!trimmedCategory) {
      return 'Category is required';
    }

    // Validate numeric fields
    const profitMargin = parseFloat(formData.profitMarginPercent);
    const costUsd = parseFloat(formData.costUsd);
    const sellRetailUsd = parseFloat(formData.sellRetailUsd);
    const sellWholesaleUsd = parseFloat(formData.sellWholesaleUsd);
    const sellSpecialUsd = parseFloat(formData.sellSpecialUsd);

    if (isNaN(profitMargin) || !isFinite(profitMargin) || profitMargin < 0) {
      return 'Profit margin must be a valid non-negative number';
    }

    if (isNaN(costUsd) || !isFinite(costUsd) || costUsd < 0) {
      return 'Cost must be a valid non-negative number';
    }

    if (isNaN(sellRetailUsd) || !isFinite(sellRetailUsd) || sellRetailUsd < 0) {
      return 'Retail price must be a valid non-negative number';
    }

    if (isNaN(sellWholesaleUsd) || !isFinite(sellWholesaleUsd) || sellWholesaleUsd < 0) {
      return 'Wholesale price must be a valid non-negative number';
    }

    if (isNaN(sellSpecialUsd) || !isFinite(sellSpecialUsd) || sellSpecialUsd < 0) {
      return 'Special price must be a valid non-negative number';
    }

    // Validate stock fields (must be valid integers)
    const stockCurrent = formData.stockCurrent.trim();
    const stockMin = formData.stockMin.trim();

    if (!stockCurrent || !/^\d+$/.test(stockCurrent)) {
      return 'Current stock must be a valid whole number';
    }

    if (!stockMin || !/^\d+$/.test(stockMin)) {
      return 'Minimum stock must be a valid whole number';
    }

    const stockCurrentNum = parseInt(stockCurrent, 10);
    const stockMinNum = parseInt(stockMin, 10);

    if (stockCurrentNum < 0) {
      return 'Current stock cannot be negative';
    }

    if (stockMinNum < 0) {
      return 'Minimum stock cannot be negative';
    }

    return null;
  };

  const isFormValid = (): boolean => {
    return validateForm() === null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check authentication first
    if (!isAuthenticated) {
      return;
    }

    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      let photoBytes: Uint8Array | null = null;
      if (imageFile) {
        photoBytes = await fileToBytes(imageFile);
      } else if (mode === 'edit' && initialItem?.photo && imagePreview) {
        photoBytes = initialItem.photo;
      }

      if (mode === 'create') {
        await createItem.mutateAsync({
          id: generateId(),
          photo: photoBytes ?? undefined,
          description: formData.description.trim(),
          category: formData.category.trim(),
          profitMarginPercent: parseFloat(formData.profitMarginPercent),
          stockCurrent: BigInt(formData.stockCurrent),
          stockMin: BigInt(formData.stockMin),
          costUsd: parseFloat(formData.costUsd),
          sellRetailUsd: parseFloat(formData.sellRetailUsd),
          sellWholesaleUsd: parseFloat(formData.sellWholesaleUsd),
          sellSpecialUsd: parseFloat(formData.sellSpecialUsd),
        });
        toast.success(t('inventory_form.success_create'));
        onOpenChange(false);
        resetForm();
      } else if (mode === 'edit' && initialItem) {
        await updateItem.mutateAsync({
          id: initialItem.id,
          payload: {
            description: formData.description.trim(),
            category: formData.category.trim(),
            profitMarginPercent: parseFloat(formData.profitMarginPercent),
            stockCurrent: BigInt(formData.stockCurrent),
            stockMin: BigInt(formData.stockMin),
            costUsd: parseFloat(formData.costUsd),
            sellRetailUsd: parseFloat(formData.sellRetailUsd),
            sellWholesaleUsd: parseFloat(formData.sellWholesaleUsd),
            sellSpecialUsd: parseFloat(formData.sellSpecialUsd),
            photo: photoBytes !== null ? photoBytes : undefined,
          },
        });
        toast.success(t('inventory_form.success_update'));
        onOpenChange(false);
        resetForm();
      }
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      const baseMsg = mode === 'create' 
        ? 'Failed to create product'
        : 'Failed to update product';
      toast.error(`${baseMsg}${errorMsg ? ': ' + errorMsg : ''}`);
      console.error('Form submission error:', error);
    }
  };

  const submitDisabled = !isAuthenticated || createItem.isPending || updateItem.isPending || !isFormValid();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? t('inventory_form.create_title') : t('inventory_form.edit_title')}
          </DialogTitle>
        </DialogHeader>

        {!isAuthenticated && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between gap-4">
              <span>{t('auth.sign_in_to_create')}</span>
              <Button
                onClick={handleSignIn}
                disabled={isLoggingIn}
                size="sm"
                className="gap-2"
              >
                <LogIn className="h-4 w-4" />
                {isLoggingIn ? t('auth.signing_in') : t('auth.sign_in')}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">{t('inventory_form.description')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t('inventory_form.description_placeholder')}
              rows={2}
              disabled={!isAuthenticated}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('inventory_form.photo')}</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-48 w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
                  disabled={!isAuthenticated}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : 'hover:border-primary'}`}>
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t('inventory_form.upload_photo')}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={!isAuthenticated}
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">{t('inventory_form.category')}</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder={t('inventory_form.category_placeholder')}
                disabled={!isAuthenticated}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profitMarginPercent">{t('inventory_form.profit_margin')}</Label>
              <Input
                id="profitMarginPercent"
                type="number"
                step="0.01"
                value={formData.profitMarginPercent}
                onChange={(e) => handleCostOrMarginChange('profitMarginPercent', e.target.value)}
                placeholder="0.00"
                disabled={!isAuthenticated}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stockCurrent">{t('inventory_form.stock_current')}</Label>
              <Input
                id="stockCurrent"
                type="number"
                value={formData.stockCurrent}
                onChange={(e) => setFormData({ ...formData, stockCurrent: e.target.value })}
                placeholder="0"
                disabled={!isAuthenticated}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockMin">{t('inventory_form.stock_min')}</Label>
              <Input
                id="stockMin"
                type="number"
                value={formData.stockMin}
                onChange={(e) => setFormData({ ...formData, stockMin: e.target.value })}
                placeholder="0"
                disabled={!isAuthenticated}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="costUsd">{t('inventory_form.cost_usd')}</Label>
            <Input
              id="costUsd"
              type="number"
              step="0.01"
              value={formData.costUsd}
              onChange={(e) => handleCostOrMarginChange('costUsd', e.target.value)}
              placeholder="0.00"
              disabled={!isAuthenticated}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sellRetailUsd">{t('inventory_form.sell_retail')}</Label>
              <Input
                id="sellRetailUsd"
                type="number"
                step="0.01"
                value={formData.sellRetailUsd}
                onChange={(e) => setFormData({ ...formData, sellRetailUsd: e.target.value })}
                placeholder="0.00"
                disabled={!isAuthenticated}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellWholesaleUsd">{t('inventory_form.sell_wholesale')}</Label>
              <Input
                id="sellWholesaleUsd"
                type="number"
                step="0.01"
                value={formData.sellWholesaleUsd}
                onChange={(e) => setFormData({ ...formData, sellWholesaleUsd: e.target.value })}
                placeholder="0.00"
                disabled={!isAuthenticated}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellSpecialUsd">{t('inventory_form.sell_special')}</Label>
              <Input
                id="sellSpecialUsd"
                type="number"
                step="0.01"
                value={formData.sellSpecialUsd}
                onChange={(e) => setFormData({ ...formData, sellSpecialUsd: e.target.value })}
                placeholder="0.00"
                disabled={!isAuthenticated}
              />
            </div>
          </div>

          <DialogFooter>
            <LargeButton
              type="submit"
              disabled={submitDisabled}
            >
              {createItem.isPending || updateItem.isPending
                ? t('action.saving')
                : mode === 'create'
                ? t('action.create')
                : t('action.save')}
            </LargeButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
