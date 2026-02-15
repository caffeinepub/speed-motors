import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, Package } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchProducts } from '@/hooks/useQueries';
import { formatUSD } from '@/lib/currency';
import { Badge } from '@/components/ui/badge';
import type { InventoryItem } from '@/backend';
import { t } from '@/lib/i18n';

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<InventoryItem[]>([]);
  const debouncedQuery = useDebounce(query, 300);
  const searchProducts = useSearchProducts();
  const navigate = useNavigate();

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        const searchResults = await searchProducts.mutateAsync(debouncedQuery);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onOpenChange]);

  const handleSelectProduct = (productId: string) => {
    navigate({ to: '/inventory' });
    onOpenChange(false);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('search.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('search.placeholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto">
            {searchProducts.isPending && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {t('search.searching')}
              </div>
            )}

            {!searchProducts.isPending && debouncedQuery && results.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {t('search.no_results')}
              </div>
            )}

            {!searchProducts.isPending && results.length > 0 && (
              <div className="space-y-2">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{product.description || product.category}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{product.category}</Badge>
                        <span>Stock: {Number(product.stockCurrent)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatUSD(product.sellRetailUsd)}</div>
                      <div className="text-xs text-muted-foreground">{t('sales.retail')}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
