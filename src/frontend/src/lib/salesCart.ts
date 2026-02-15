import type { InventoryItem } from '@/backend';

export type PriceType = 'retail' | 'wholesale' | 'special';

export type CartItem = {
  product: InventoryItem;
  quantity: number;
  priceType: PriceType;
};

/**
 * Safely clone an InventoryItem to avoid reference issues in React state
 */
export function cloneInventoryItem(item: InventoryItem): InventoryItem {
  return {
    id: item.id,
    description: item.description,
    category: item.category,
    stockCurrent: item.stockCurrent,
    stockMin: item.stockMin,
    costUsd: item.costUsd,
    sellRetailUsd: item.sellRetailUsd,
    sellWholesaleUsd: item.sellWholesaleUsd,
    sellSpecialUsd: item.sellSpecialUsd,
    profitMarginPercent: item.profitMarginPercent,
    photo: item.photo,
  };
}

/**
 * Validate if quantity is available in stock
 */
export function isQuantityAvailable(item: InventoryItem, quantity: number): boolean {
  return quantity > 0 && quantity <= Number(item.stockCurrent);
}

/**
 * Get price for a cart item based on price type
 */
export function getItemPrice(item: CartItem): number {
  switch (item.priceType) {
    case 'retail':
      return item.product.sellRetailUsd;
    case 'wholesale':
      return item.product.sellWholesaleUsd;
    case 'special':
      return item.product.sellSpecialUsd;
    default:
      return item.product.sellRetailUsd;
  }
}

/**
 * Calculate subtotal for a cart item
 */
export function getItemSubtotal(item: CartItem): number {
  return getItemPrice(item) * item.quantity;
}

/**
 * Calculate total amount for all cart items
 */
export function calculateCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + getItemSubtotal(item), 0);
}

/**
 * Add product to cart or increase quantity if already exists
 */
export function addProductToCart(
  cart: CartItem[],
  product: InventoryItem
): CartItem[] {
  const clonedProduct = cloneInventoryItem(product);
  const existingIndex = cart.findIndex(item => item.product.id === product.id);

  if (existingIndex >= 0) {
    // Product exists, increase quantity
    const newCart = [...cart];
    const existingItem = newCart[existingIndex];
    const newQuantity = existingItem.quantity + 1;

    if (!isQuantityAvailable(clonedProduct, newQuantity)) {
      return cart; // Return unchanged if not enough stock
    }

    newCart[existingIndex] = {
      ...existingItem,
      quantity: newQuantity,
    };
    return newCart;
  } else {
    // New product, add to cart
    return [
      ...cart,
      {
        product: clonedProduct,
        quantity: 1,
        priceType: 'retail' as PriceType,
      },
    ];
  }
}

/**
 * Update quantity for a cart item
 */
export function updateCartItemQuantity(
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] {
  if (newQuantity <= 0) {
    return cart.filter(item => item.product.id !== productId);
  }

  return cart.map(item => {
    if (item.product.id === productId) {
      if (!isQuantityAvailable(item.product, newQuantity)) {
        return item; // Return unchanged if not enough stock
      }
      return { ...item, quantity: newQuantity };
    }
    return item;
  });
}

/**
 * Update price type for a cart item
 */
export function updateCartItemPriceType(
  cart: CartItem[],
  productId: string,
  priceType: PriceType
): CartItem[] {
  return cart.map(item =>
    item.product.id === productId ? { ...item, priceType } : item
  );
}

/**
 * Remove item from cart
 */
export function removeCartItem(cart: CartItem[], productId: string): CartItem[] {
  return cart.filter(item => item.product.id !== productId);
}
