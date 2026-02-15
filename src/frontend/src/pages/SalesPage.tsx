import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, X, Search } from 'lucide-react';
import { useInventory, usePostSale, useSearchProducts, useCustomers } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import LargeButton from '@/components/LargeButton';
import { formatUSD } from '@/lib/currency';
import { generateId } from '@/lib/utils';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import type { InventoryItem } from '@/backend';
import { t } from '@/lib/i18n';

type CartItem = {
  product: InventoryItem;
  quantity: number;
  priceType: 'retail' | 'wholesale' | 'special';
};

export default function SalesPage() {
  const { data: inventory = [] } = useInventory();
  const { data: customers = [] } = useCustomers();
  const postSale = usePostSale();
  const searchProducts = useSearchProducts();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<InventoryItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'immediate' | 'credit'>('immediate');
  const [customerName, setCustomerName] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const handleSearch = async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const results = await searchProducts.mutateAsync(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    };

    handleSearch(debouncedSearch);
  }, [debouncedSearch, searchProducts]);

  const addToCart = (product: InventoryItem) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCart([...cart, { product, quantity: 1, priceType: 'retail' }]);
    }
    
    setSearchQuery('');
    setSearchResults([]);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;

    if (newQuantity > Number(item.product.stockCurrent)) {
      toast.error(t('sales.insufficient_stock', { product: item.product.description || item.product.category }));
      return;
    }

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const updatePriceType = (productId: string, priceType: 'retail' | 'wholesale' | 'special') => {
    setCart(cart.map(item => 
      item.product.id === productId 
        ? { ...item, priceType }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const getItemPrice = (item: CartItem): number => {
    switch (item.priceType) {
      case 'retail': return item.product.sellRetailUsd;
      case 'wholesale': return item.product.sellWholesaleUsd;
      case 'special': return item.product.sellSpecialUsd;
    }
  };

  const getItemSubtotal = (item: CartItem): number => {
    return getItemPrice(item) * item.quantity;
  };

  const getTotalAmount = (): number => {
    return cart.reduce((sum, item) => sum + getItemSubtotal(item), 0);
  };

  const handleCompleteSale = async () => {
    if (cart.length === 0) return;

    if (paymentMethod === 'credit' && !customerName.trim()) {
      toast.error(t('sales.customer_required'));
      return;
    }

    try {
      await postSale.mutateAsync({
        id: generateId(),
        customerName: paymentMethod === 'credit' ? customerName : t('sales.cash_customer'),
        itemsSold: cart.map(item => item.product),
        totalAmountUsd: getTotalAmount(),
        isCreditSale: paymentMethod === 'credit',
      });

      toast.success(t('sales.success'));
      setCart([]);
      setCustomerName('');
      setPaymentMethod('immediate');
    } catch (error) {
      toast.error(t('sales.error'));
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('sales.title')}</h1>
        <p className="text-muted-foreground">{t('sales.subtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Product Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {t('action.search')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('sales.search_products')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-muted"
                  >
                    <div>
                      <p className="font-medium">{product.description || product.category}</p>
                      <p className="text-sm text-muted-foreground">
                        Stock: {Number(product.stockCurrent)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatUSD(product.sellRetailUsd)}</p>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shopping Cart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {t('sales.cart')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t('sales.empty_cart')}</p>
                <p className="text-sm text-muted-foreground">{t('sales.start_adding_products')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="space-y-2 rounded-lg border p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{item.product.description || item.product.category}</p>
                        <Badge variant="outline" className="mt-1">{item.product.category}</Badge>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Label className="text-xs">{t('sales.quantity')}:</Label>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="rounded border p-1 hover:bg-muted"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="rounded border p-1 hover:bg-muted"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">{t('sales.price_type')}:</Label>
                      <Select
                        value={item.priceType}
                        onValueChange={(value) => updatePriceType(item.product.id, value as 'retail' | 'wholesale' | 'special')}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail">{t('sales.retail')} - {formatUSD(item.product.sellRetailUsd)}</SelectItem>
                          <SelectItem value="wholesale">{t('sales.wholesale')} - {formatUSD(item.product.sellWholesaleUsd)}</SelectItem>
                          <SelectItem value="special">{t('sales.special')} - {formatUSD(item.product.sellSpecialUsd)}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('sales.subtotal')}:</span>
                      <span className="font-medium">{formatUSD(getItemSubtotal(item))}</span>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t('sales.total')}:</span>
                    <span>{formatUSD(getTotalAmount())}</span>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('sales.payment_method')}</Label>
                    <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'immediate' | 'credit')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">{t('sales.immediate')}</SelectItem>
                        <SelectItem value="credit">{t('sales.credit')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentMethod === 'credit' && (
                    <div className="space-y-2">
                      <Label>{t('sales.customer_name')} *</Label>
                      <Input
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={t('sales.customer_name_placeholder')}
                        list="customers-list"
                      />
                      <datalist id="customers-list">
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.name} />
                        ))}
                      </datalist>
                      <p className="text-xs text-muted-foreground">{t('sales.payment_term')}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <LargeButton
                      variant="outline"
                      onClick={() => setCart([])}
                      className="flex-1"
                    >
                      {t('sales.clear_cart')}
                    </LargeButton>
                    <LargeButton
                      onClick={handleCompleteSale}
                      disabled={postSale.isPending}
                      className="flex-1"
                    >
                      {postSale.isPending ? t('sales.processing') : t('sales.complete_sale')}
                    </LargeButton>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
