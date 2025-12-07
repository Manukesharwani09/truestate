/**
 * Sales Data Hook
 * Uses React Query for data fetching and caching
 */

import { useQuery } from '@tanstack/react-query';
import { getSales, getFilterOptions, getStats } from '../services/api';
import { useFilterStore } from '../store/useFilterStore';

const PAGE_SIZE = 10;

export function useSalesData() {
  const { searchQuery, currentPage, sortBy, sortDir, filters } = useFilterStore();

  return useQuery({
    queryKey: ['sales', searchQuery, currentPage, sortBy, sortDir, filters],
    queryFn: () =>
      getSales({
        page: currentPage,
        pageSize: PAGE_SIZE,
        search: searchQuery,
        sortBy,
        sortDir,
        filters,
      }),
    staleTime: 30000, // 30 seconds
  });
}

export function useFilterOptions() {
  return useQuery({
    queryKey: ['filterOptions'],
    queryFn: getFilterOptions,
    staleTime: Infinity, // Filter options don't change
  });
}

export function useStats() {
  const { searchQuery, filters } = useFilterStore();

  return useQuery({
    queryKey: ['stats', searchQuery, filters],
    queryFn: () => getStats({ filters, searchPhrase: searchQuery }),
    staleTime: 30000, // 30 seconds
  });
}
