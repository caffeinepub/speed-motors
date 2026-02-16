import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  InventoryItem,
  InventoryItemCreatePayload,
  UpdateInventoryItemPayload,
  ExchangeRate,
  Customer,
  Sale,
  UpdateSalePayload,
  CashboxEntry,
  Variant__in_out,
  TopSearchedProduct,
  TopSellingProduct,
  NetProfitEntry,
  Supplier,
  CreateSupplierPayload,
  Closure,
  CreateClosurePayload,
  IntelligenceSearchResult,
} from '@/backend';

// Inventory Queries
export function useInventory() {
  const { actor, isFetching } = useActor();

  return useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
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
  const { actor } = useActor();
  const queryClient = useQueryClient();

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
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateInventoryItemPayload }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateInventoryItem(id, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', variables.id] });
    },
  });
}

export function useSearchProducts() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (searchQuery: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchProducts(searchQuery);
    },
  });
}

export function useIntelligenceSearch() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (searchTerm: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.intelligenceSearch(searchTerm);
    },
  });
}

export function useCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDistinctCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

// Exchange Rate Queries
export function useExchangeRates() {
  const { actor, isFetching } = useActor();

  return useQuery<ExchangeRate[]>({
    queryKey: ['exchangeRates'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listExchangeRates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLatestExchangeRate() {
  const { actor, isFetching } = useActor();

  return useQuery<ExchangeRate>({
    queryKey: ['exchangeRates', 'latest'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLatestExchangeRate();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddExchangeRate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bcvVesPerUsd, copPerUsd }: { bcvVesPerUsd: number; copPerUsd: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addExchangeRate(bcvVesPerUsd, copPerUsd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exchangeRates'] });
    },
  });
}

// Customer Queries
export function useCustomers() {
  const { actor, isFetching } = useActor();

  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listCustomers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCustomer(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Customer>({
    queryKey: ['customers', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCustomer(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, contactInfo }: { id: string; name: string; contactInfo: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCustomer(id, name, contactInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useModifyCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, contactInfo, debtUsd }: { id: string; name: string; contactInfo: string; debtUsd: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.modifyCustomer(id, name, contactInfo, debtUsd);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', variables.id] });
    },
  });
}

// Sales Queries
export function useSales() {
  const { actor, isFetching } = useActor();

  return useQuery<Sale[]>({
    queryKey: ['sales'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't have listSales, so we return empty array
      // Sales are tracked via delinquent sales for now
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePostSale() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      customerName,
      itemsSold,
      totalAmountUsd,
      isCreditSale,
    }: {
      id: string;
      customerName: string;
      itemsSold: InventoryItem[];
      totalAmountUsd: number;
      isCreditSale: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.postSale(id, customerName, itemsSold, totalAmountUsd, isCreditSale);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['cashboxEntries'] });
      queryClient.invalidateQueries({ queryKey: ['delinquentSales'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    },
  });
}

export function useModifySale() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateSalePayload }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.modifySale(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['delinquentSales'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useDelinquentSales() {
  const { actor, isFetching } = useActor();

  return useQuery<Sale[]>({
    queryKey: ['delinquentSales'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listDelinquentSales();
    },
    enabled: !!actor && !isFetching,
  });
}

// Cashbox Queries
export function useCashboxEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<CashboxEntry[]>({
    queryKey: ['cashboxEntries'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
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
      if (!actor) throw new Error('Actor not available');
      return actor.getCashboxTotals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCashboxEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      entryType,
      amountUsd,
      currency,
      description,
    }: {
      id: string;
      entryType: Variant__in_out;
      amountUsd: number;
      currency: string;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCashboxEntry(id, entryType, amountUsd, currency, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashboxEntries'] });
      queryClient.invalidateQueries({ queryKey: ['cashboxTotals'] });
    },
  });
}

// Analytics Queries
export function useTopSearchedProducts(count: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<TopSearchedProduct[]>({
    queryKey: ['topSearchedProducts', count.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
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
      if (!actor) throw new Error('Actor not available');
      return actor.getTopItemsSold(count);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useNetProfitByInterval(interval: string) {
  const { actor, isFetching } = useActor();

  return useQuery<NetProfitEntry[]>({
    queryKey: ['netProfit', interval],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.aggregateNetProfitByInterval(interval);
    },
    enabled: !!actor && !isFetching,
  });
}

// Supplier Queries
export function useSuppliers() {
  const { actor, isFetching } = useActor();

  return useQuery<Supplier[]>({
    queryKey: ['suppliers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listSuppliers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSupplier() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

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

export function useModifySupplier() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, contactInfo, address }: { id: string; name: string; contactInfo: string; address: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.modifySupplier(id, name, contactInfo, address);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers', variables.id] });
    },
  });
}

// Closure Queries
export function useClosures() {
  const { actor, isFetching } = useActor();

  return useQuery<Closure[]>({
    queryKey: ['closures'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listClosures();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateClosure() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

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

// Build Artifacts Query (Admin-only development feature)
export function useBuildArtifactsInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['buildArtifacts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getBuildArtifactsZipUrls();
      } catch (error: any) {
        // Expected to fail on deployed versions
        throw new Error(error.message || 'Build artifacts not available');
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}
