import { useState, useEffect } from 'react';
import { Search, Package, Users, Truck, ShoppingCart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIntelligenceSearch } from '@/hooks/useQueries';
import { useDebounce } from '@/hooks/useDebounce';
import { useNavigate } from '@tanstack/react-router';
import { t } from '@/lib/i18n';
import type { IntelligenceSearchResult } from '@/backend';

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const intelligenceSearch = useIntelligenceSearch();
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      intelligenceSearch.mutate(debouncedSearch);
    }
  }, [debouncedSearch]);

  const results = intelligenceSearch.data || [];

  const handleResultClick = (result: IntelligenceSearchResult) => {
    if (result.__kind__ === 'inventoryItem') {
      navigate({ to: '/inventory' });
    } else if (result.__kind__ === 'customer') {
      navigate({ to: `/customers/${result.customer.id}` });
    } else if (result.__kind__ === 'supplier') {
      navigate({ to: `/suppliers/${result.supplier.id}` });
    } else if (result.__kind__ === 'sale') {
      navigate({ to: '/sales', search: { saleId: result.sale.id } });
    }
    onOpenChange(false);
    setSearchTerm('');
  };

  const getResultIcon = (result: IntelligenceSearchResult) => {
    if (result.__kind__ === 'inventoryItem') return <Package className="h-4 w-4" />;
    if (result.__kind__ === 'customer') return <Users className="h-4 w-4" />;
    if (result.__kind__ === 'supplier') return <Truck className="h-4 w-4" />;
    if (result.__kind__ === 'sale') return <ShoppingCart className="h-4 w-4" />;
    return null;
  };

  const getResultLabel = (result: IntelligenceSearchResult) => {
    if (result.__kind__ === 'inventoryItem') return t('search.inventory');
    if (result.__kind__ === 'customer') return t('search.customer');
    if (result.__kind__ === 'supplier') return t('search.supplier');
    if (result.__kind__ === 'sale') return t('search.sale');
    return '';
  };

  const getResultTitle = (result: IntelligenceSearchResult) => {
    if (result.__kind__ === 'inventoryItem') return result.inventoryItem.description || result.inventoryItem.id;
    if (result.__kind__ === 'customer') return result.customer.name;
    if (result.__kind__ === 'supplier') return result.supplier.name;
    if (result.__kind__ === 'sale') return `${t('search.sale')} - ${result.sale.customerName}`;
    return '';
  };

  const getResultSubtitle = (result: IntelligenceSearchResult) => {
    if (result.__kind__ === 'inventoryItem') return `${t('table.category')}: ${result.inventoryItem.category}`;
    if (result.__kind__ === 'customer') return result.customer.contactInfo;
    if (result.__kind__ === 'supplier') return result.supplier.contactInfo;
    if (result.__kind__ === 'sale') return `${t('table.total')}: $${result.sale.totalAmountUsd.toFixed(2)}`;
    return '';
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {intelligenceSearch.isPending && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {t('action.searching')}
            </div>
          )}

          {!intelligenceSearch.isPending && searchTerm.trim().length >= 2 && results.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {t('search.no_results')}
            </div>
          )}

          {!intelligenceSearch.isPending && results.length > 0 && (
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {results.map((result, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="h-auto w-full justify-start p-3 text-left"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex w-full items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      {getResultIcon(result)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{getResultTitle(result)}</span>
                        <Badge variant="outline" className="text-xs">
                          {getResultLabel(result)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getResultSubtitle(result)}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}

          {searchTerm.trim().length < 2 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {t('search.hint')}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
