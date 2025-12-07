/**
 * Filter State Management
 * Using Zustand for lightweight, performant state management
 */

import { create } from 'zustand';
import { Filters, SortDirection } from '../types';

interface FilterState {
  filters: Partial<Filters>;
  searchQuery: string;
  currentPage: number;
  sortBy: string;
  sortDir: SortDirection;

  setFilter: (key: keyof Filters, value: any) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setSorting: (sortBy: string, sortDir: SortDirection) => void;
  resetFilters: () => void;
}

const initialFilters: Partial<Filters> = {
  customerRegion: [],
  gender: '',
  ageRange: undefined,
  productCategory: [],
  tags: [],
  paymentMethod: [],
  dateRange: { from: '', to: '' },
  orderStatus: [],
};

export const useFilterStore = create<FilterState>((set) => ({
  filters: initialFilters,
  searchQuery: '',
  currentPage: 0,
  sortBy: 'date',
  sortDir: SortDirection.DESC,

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      currentPage: 0, // Reset to first page when filter changes
    })),

  setSearchQuery: (query) =>
    set({
      searchQuery: query,
      currentPage: 0, // Reset to first page when search changes
    }),

  setCurrentPage: (page) => set({ currentPage: page }),

  setSorting: (sortBy, sortDir) =>
    set({
      sortBy,
      sortDir,
      currentPage: 0, // Reset to first page when sorting changes
    }),

  resetFilters: () =>
    set({
      filters: initialFilters,
      searchQuery: '',
      currentPage: 0,
    }),
}));
