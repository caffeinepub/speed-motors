import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { InventoryItem, ExchangeRate, Customer } from '../backend';

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
      if (!actor) throw new Error('Actor not initialized');
      return actor.getInventoryItem(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateInventoryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      photo: Uint8Array | null;
      description: string;
      category: string;
      stockCurrent: bigint;
      stockMin: bigint;
      costUsd: number;
      sellRetailUsd: number;
      sellWholesaleUsd: number;
      sellSpecialUsd: number;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createInventoryItem(
        data.id,
        data.photo,
        data.description,
        data.category,
        data.stockCurrent,
        data.stockMin,
        data.costUsd,
        data.sellRetailUsd,
        data.sellWholesaleUsd,
        data.sellSpecialUsd
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

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
    queryKey: ['exchangeRates', 'latest'],
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
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { bcvVesPerUsd: number; copPerUsd: number }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addExchangeRate(data.bcvVesPerUsd, data.copPerUsd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exchangeRates'] });
    },
  });
}

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
    queryKey: ['customers', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getCustomer(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; name: string; contactInfo: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createCustomer(data.id, data.name, data.contactInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useSearchProducts(query: string) {
  const { actor, isFetching } = useActor();

  return useQuery<InventoryItem[]>({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!actor || !query) return [];
      return actor.searchProducts(query);
    },
    enabled: !!actor && !isFetching && query.length > 0,
  });
}
