import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  InventoryItem, 
  UpdateInventoryItemPayload, 
  ExchangeRate, 
  Customer, 
  Sale,
  CashboxEntry,
  Variant__in_out,
  TopSellingProduct,
  TopSearchedProduct,
  NetProfitEntry,
  Supplier,
  CreateSupplierPayload,
  Closure,
  CreateClosurePayload,
  InventoryItemCreatePayload
} from '@/backend';

// Inventory Queries
export function useInventory() {
  const { actor, isFetching } = useActor();

  return useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listInventory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useInventoryItem(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<InventoryItem>({
    queryKey: ['inventory', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getInventoryItem(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (payload: InventoryItemCreatePayload) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createInventoryItem(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { id: string; payload: UpdateInventoryItemPayload }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateInventoryItem(data.id, data.payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

// Exchange Rate Queries
export function useExchangeRates() {
  const { actor, isFetching } = useActor();

  return useQuery<ExchangeRate[]>({
    queryKey: ['exchangeRates'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listExchangeRates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLatestExchangeRate() {
  const { actor, isFetching } = useActor();

  return useQuery<ExchangeRate | null>({
    queryKey: ['latestExchangeRate'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getLatestExchangeRate();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddExchangeRate() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { bcvVesPerUsd: number; copPerUsd: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addExchangeRate(data.bcvVesPerUsd, data.copPerUsd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exchangeRates'] });
      queryClient.invalidateQueries({ queryKey: ['latestExchangeRate'] });
    },
  });
}

// Customer Queries
export function useCustomers() {
  const { actor, isFetching } = useActor();

  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCustomers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCustomer(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Customer>({
    queryKey: ['customer', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCustomer(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { id: string; name: string; contactInfo: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCustomer(data.id, data.name, data.contactInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

// Search
export function useSearchProducts() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (searchQuery: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchProducts(searchQuery);
    },
  });
}

// Delinquent Sales
export function useDelinquentSales() {
  const { actor, isFetching } = useActor();

  return useQuery<Sale[]>({
    queryKey: ['delinquentSales'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listDelinquentSales();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias for backward compatibility
export const useOverdueDelinquentSales = useDelinquentSales;

// Sales
export function usePostSale() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      customerName: string;
      itemsSold: InventoryItem[];
      totalAmountUsd: number;
      isCreditSale: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.postSale(
        data.id,
        data.customerName,
        data.itemsSold,
        data.totalAmountUsd,
        data.isCreditSale
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['cashboxEntries'] });
      queryClient.invalidateQueries({ queryKey: ['cashboxTotals'] });
    },
  });
}

// Cashbox
export function useCashboxEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<CashboxEntry[]>({
    queryKey: ['cashboxEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCashboxEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCashboxTotals() {
  const { actor, isFetching } = useActor();

  return useQuery<{ usd: number; ves: number; cop: number }>({
    queryKey: ['cashboxTotals'],
    queryFn: async () => {
      if (!actor) return { usd: 0, ves: 0, cop: 0 };
      return actor.getCashboxTotals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCashboxEntry() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      entryType: Variant__in_out;
      amountUsd: number;
      currency: string;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCashboxEntry(
        data.id,
        data.entryType,
        data.amountUsd,
        data.currency,
        data.description
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashboxEntries'] });
      queryClient.invalidateQueries({ queryKey: ['cashboxTotals'] });
    },
  });
}

// Analytics
export function useTopSearchedProducts(count: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<TopSearchedProduct[]>({
    queryKey: ['topSearchedProducts', count.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopSearchedProducts(count);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTopItemsSold(count: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<TopSellingProduct[]>({
    queryKey: ['topItemsSold', count.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopItemsSold(count);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useNetProfitByInterval(interval: string) {
  const { actor, isFetching } = useActor();

  return useQuery<NetProfitEntry[]>({
    queryKey: ['netProfitByInterval', interval],
    queryFn: async () => {
      if (!actor) return [];
      return actor.aggregateNetProfitByInterval(interval);
    },
    enabled: !!actor && !isFetching,
  });
}

// Suppliers
export function useSuppliers() {
  const { actor, isFetching } = useActor();

  return useQuery<Supplier[]>({
    queryKey: ['suppliers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSuppliers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (payload: CreateSupplierPayload) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSupplier(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}

// Closures
export function useClosures() {
  const { actor, isFetching } = useActor();

  return useQuery<Closure[]>({
    queryKey: ['closures'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listClosures();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateClosure() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (payload: CreateClosurePayload) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClosure(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['closures'] });
    },
  });
}

// Categories
export function useDistinctCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['distinctCategories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDistinctCategories();
    },
    enabled: !!actor && !isFetching,
  });
}
