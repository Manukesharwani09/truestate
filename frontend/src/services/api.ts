/**
 * API Service
 * Handles all HTTP requests to the backend
 */

import axios from 'axios';
import { SalesResponse, FilterOptions, Stats, Filters, SortDirection } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface GetSalesParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDir?: SortDirection;
  filters?: Partial<Filters>;
}

/**
 * Get sales data with search, filter, sort, and pagination
 */
export async function getSales(params: GetSalesParams): Promise<SalesResponse> {
  const response = await api.post<SalesResponse>('/sales', {
    currentPage: params.page,
    pageSize: params.pageSize,
    searchPhrase: params.search,
    searchOn: params.search ? ['customerName', 'phoneNumber'] : undefined,
    sortBy: params.sortBy || 'date',
    sortDir: params.sortDir || SortDirection.DESC,
    filters: params.filters || {},
  });

  return response.data;
}

/**
 * Get available filter options
 */
export async function getFilterOptions(): Promise<FilterOptions> {
  const response = await api.get<FilterOptions>('/sales/filters');
  return response.data;
}

/**
 * Get sales statistics with optional filters
 */
export async function getStats(params?: { filters?: Partial<Filters>; searchPhrase?: string }): Promise<Stats> {
  const response = await api.post<Stats>('/sales/stats', {
    filters: params?.filters || {},
    searchPhrase: params?.searchPhrase,
  });
  return response.data;
}

export default api;
