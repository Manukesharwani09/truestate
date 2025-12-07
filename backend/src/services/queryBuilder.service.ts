/**
 * Query Builder Service
 * Advanced search, filter, pagination, and sorting implementation
 * Adapted from Go query builder with Prisma integration
 */

import { Prisma } from '@prisma/client';
import {
  QueryBuilderRequest,
  QueryBuilderResponse,
  FilterOperation,
  SortDirection,
  QueryFilter,
} from '../types/queryBuilder.types';

export class QueryBuilderService {
  /**
   * Build WHERE conditions from search phrase and filters
   */
  static buildWhereConditions(request: QueryBuilderRequest): Prisma.SaleWhereInput {
    const conditions: Prisma.SaleWhereInput[] = [];

    // 1. Build search conditions (OR across searchOn fields)
    if (request.searchPhrase && request.searchOn && request.searchOn.length > 0) {
      const searchConditions = request.searchOn.map((field) => ({
        [field]: {
          contains: request.searchPhrase,
          mode: Prisma.QueryMode.insensitive, // Case-insensitive
        },
      }));

      conditions.push({
        OR: searchConditions as any,
      });
    }

    // 2. Build filter conditions (AND across all filters)
    if (request.filters && request.filters.length > 0) {
      for (const filter of request.filters) {
        const condition = this.buildFilterCondition(filter);
        if (condition) {
          conditions.push(condition);
        }
      }
    }

    // Combine all conditions with AND
    if (conditions.length === 0) {
      return {};
    }

    if (conditions.length === 1) {
      return conditions[0];
    }

    return {
      AND: conditions,
    };
  }

  /**
   * Build a single filter condition based on operation type
   */
  private static buildFilterCondition(filter: QueryFilter): Prisma.SaleWhereInput | null {
    const { field, operation, value } = filter;

    switch (operation) {
      case FilterOperation.EQUALS:
        return { [field]: { equals: value } };

      case FilterOperation.NOT_EQUALS:
        return { [field]: { not: value } };

      case FilterOperation.GREATER_THAN:
        return { [field]: { gt: value } };

      case FilterOperation.LESSER_THAN:
        return { [field]: { lt: value } };

      case FilterOperation.GREATER_THAN_OR_EQUALS:
        return { [field]: { gte: value } };

      case FilterOperation.LESSER_THAN_OR_EQUALS:
        return { [field]: { lte: value } };

      case FilterOperation.IS_NULL:
        return { [field]: { equals: null } };

      case FilterOperation.IS_NOT_NULL:
        return { [field]: { not: null } };

      case FilterOperation.LIKE:
        return {
          [field]: {
            contains: value,
            mode: Prisma.QueryMode.insensitive,
          },
        };

      case FilterOperation.NOT_LIKE:
        return {
          [field]: {
            not: {
              contains: value,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        };

      case FilterOperation.IN:
        return { [field]: { in: Array.isArray(value) ? value : [value] } };

      case FilterOperation.NOT_IN:
        return { [field]: { notIn: Array.isArray(value) ? value : [value] } };

      case FilterOperation.BETWEEN:
        if (Array.isArray(value) && value.length === 2) {
          return {
            AND: [{ [field]: { gte: value[0] } }, { [field]: { lte: value[1] } }],
          };
        }
        return null;

      case FilterOperation.ARRAY_HAS_SOME:
        // For array fields, check if the array contains any of the specified values
        return { [field]: { hasSome: Array.isArray(value) ? value : [value] } };

      default:
        return null;
    }
  }

  /**
   * Build ORDER BY clause
   */
  static buildOrderBy(request: QueryBuilderRequest): Prisma.SaleOrderByWithRelationInput | undefined {
    if (!request.sortBy) {
      return undefined;
    }

    const direction = request.sortDir === SortDirection.DESC ? 'desc' : 'asc';

    return {
      [request.sortBy]: direction,
    };
  }

  /**
   * Build pagination parameters
   */
  static buildPagination(request: QueryBuilderRequest): { skip: number; take: number } {
    const pageSize = request.pageSize > 0 ? request.pageSize : 10;
    const currentPage = request.currentPage >= 0 ? request.currentPage : 0;

    return {
      skip: currentPage * pageSize,
      take: pageSize,
    };
  }

  /**
   * Execute complete query with counting, filtering, sorting, and pagination
   */
  static async executeQuery<T>(
    model: any, // Prisma model delegate
    request: QueryBuilderRequest
  ): Promise<QueryBuilderResponse<T>> {
    // Build WHERE conditions
    const where = this.buildWhereConditions(request);

    // Build ORDER BY
    const orderBy = this.buildOrderBy(request);

    // Build pagination
    const { skip, take } = this.buildPagination(request);

    // Execute count query (separate, with same WHERE conditions)
    const totalElements = await model.count({ where });

    // Execute main query
    const data = await model.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalElements / take);

    return {
      currentPage: request.currentPage,
      pageSize: take,
      totalElements,
      totalPages,
      sortBy: request.sortBy,
      sortDir: request.sortDir,
      searchPhrase: request.searchPhrase,
      searchOn: request.searchOn,
      filters: request.filters,
      data,
    };
  }
}
