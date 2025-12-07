/**
 * Query Builder Types - Adapted from Go implementation
 * Provides flexible search, filtering, pagination, and sorting
 */

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export enum FilterOperation {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  LESSER_THAN = 'LESSER_THAN',
  GREATER_THAN_OR_EQUALS = 'GREATER_THAN_OR_EQUALS',
  LESSER_THAN_OR_EQUALS = 'LESSER_THAN_OR_EQUALS',
  IS_NULL = 'IS_NULL',
  IS_NOT_NULL = 'IS_NOT_NULL',
  LIKE = 'LIKE',
  NOT_LIKE = 'NOT_LIKE',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  BETWEEN = 'BETWEEN',
  ARRAY_HAS_SOME = 'ARRAY_HAS_SOME', // For array fields - matches if array contains any of the values
}

export interface QueryFilter {
  field: string;
  operation: FilterOperation;
  value?: any;
}

export interface QueryBuilderRequest {
  currentPage: number;
  pageSize: number;
  sortBy?: string;
  sortDir?: SortDirection;
  searchPhrase?: string;
  searchOn?: string[];
  filters?: QueryFilter[];
}

export interface QueryBuilderResponse<T> {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  sortBy?: string;
  sortDir?: SortDirection;
  searchPhrase?: string;
  searchOn?: string[];
  filters?: QueryFilter[];
  data: T[];
}

export interface DateRangeFilter {
  from?: string;
  to?: string;
}

export interface AgeRangeFilter {
  min?: number;
  max?: number;
}
