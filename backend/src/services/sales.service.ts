/**
 * Sales Service
 * Business logic for sales data management
 */

import { PrismaClient } from '@prisma/client';
import { QueryBuilderRequest } from '../types/queryBuilder.types';
import { QueryBuilderService } from './queryBuilder.service';
import { SaleFilters } from '../types/sale.types';
import { FilterOperation } from '../types/queryBuilder.types';

const prisma = new PrismaClient();

export class SalesService {
  /**
   * Get sales with advanced search, filter, sort, and pagination
   */
  static async getSales(queryRequest: QueryBuilderRequest) {
    return await QueryBuilderService.executeQuery(prisma.sale, queryRequest);
  }

  /**
   * Get unique filter options for dropdowns
   */
  static async getFilterOptions() {
    const [
      customerRegions,
      genders,
      productCategories,
      paymentMethods,
      orderStatuses,
      deliveryTypes,
    ] = await Promise.all([
      prisma.sale.findMany({
        select: { customerRegion: true },
        distinct: ['customerRegion'],
        orderBy: { customerRegion: 'asc' },
      }),
      prisma.sale.findMany({
        select: { gender: true },
        distinct: ['gender'],
        orderBy: { gender: 'asc' },
      }),
      prisma.sale.findMany({
        select: { productCategory: true },
        distinct: ['productCategory'],
        orderBy: { productCategory: 'asc' },
      }),
      prisma.sale.findMany({
        select: { paymentMethod: true },
        distinct: ['paymentMethod'],
        orderBy: { paymentMethod: 'asc' },
      }),
      prisma.sale.findMany({
        select: { orderStatus: true },
        distinct: ['orderStatus'],
        orderBy: { orderStatus: 'asc' },
      }),
      prisma.sale.findMany({
        select: { deliveryType: true },
        distinct: ['deliveryType'],
        orderBy: { deliveryType: 'asc' },
      }),
    ]);

    // Get unique tags (flattened from arrays)
    const allTags = await prisma.sale.findMany({
      select: { tags: true },
    });

    const uniqueTags = Array.from(
      new Set(allTags.flatMap((sale) => sale.tags))
    ).sort();

    // Get age range
    const ageStats = await prisma.sale.aggregate({
      _min: { age: true },
      _max: { age: true },
    });

    return {
      customerRegions: customerRegions.map((r) => r.customerRegion),
      genders: genders.map((g) => g.gender),
      productCategories: productCategories.map((c) => c.productCategory),
      paymentMethods: paymentMethods.map((p) => p.paymentMethod),
      orderStatuses: orderStatuses.map((s) => s.orderStatus),
      deliveryTypes: deliveryTypes.map((d) => d.deliveryType),
      tags: uniqueTags,
      ageRange: {
        min: ageStats._min.age || 0,
        max: ageStats._max.age || 100,
      },
    };
  }

  /**
   * Get sales statistics with optional filters
   */
  static async getSalesStats(filters: any[] = [], searchPhrase?: string, searchOn?: string[]) {
    // Build where clause from filters
    const whereClause: any = {};

    // Add filters
    if (filters.length > 0) {
      const filterConditions = filters.map((filter) => {
        const { field, operation, value } = filter;

        switch (operation) {
          case FilterOperation.EQUALS:
            return { [field]: value };
          case FilterOperation.IN:
            return { [field]: { in: value } };
          case FilterOperation.GREATER_THAN_OR_EQUALS:
            return { [field]: { gte: value } };
          case FilterOperation.LESSER_THAN_OR_EQUALS:
            return { [field]: { lte: value } };
          case FilterOperation.ARRAY_HAS_SOME:
            return { [field]: { hasSome: value } };
          default:
            return {};
        }
      });

      whereClause.AND = filterConditions;
    }

    // Add search
    if (searchPhrase && searchOn && searchOn.length > 0) {
      const searchConditions = searchOn.map((field) => ({
        [field]: {
          contains: searchPhrase,
          mode: 'insensitive' as const,
        },
      }));

      if (whereClause.AND) {
        whereClause.AND.push({ OR: searchConditions });
      } else {
        whereClause.OR = searchConditions;
      }
    }

    const [stats] = await Promise.all([
      prisma.sale.aggregate({
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
        _sum: {
          quantity: true,
          finalAmount: true,
          totalAmount: true,
        },
        _count: true,
      }),
    ]);

    const totalUnitsSold = stats._sum.quantity || 0;
    const totalAmount = stats._sum.totalAmount || 0;
    const totalRevenue = stats._sum.finalAmount || 0;
    const totalDiscount = totalAmount - totalRevenue;
    const totalSalesRecords = stats._count;

    return {
      totalUnitsSold,
      totalAmount,
      totalRevenue,
      totalDiscount,
      totalSalesRecords,
    };
  }

  /**
   * Convert UI filters to QueryBuilder filters
   */
  static convertFiltersToQueryBuilder(filters: SaleFilters) {
    const queryFilters: any[] = [];

    // Customer Region (multi-select)
    if (filters.customerRegion && filters.customerRegion.length > 0) {
      queryFilters.push({
        field: 'customerRegion',
        operation: FilterOperation.IN,
        value: filters.customerRegion,
      });
    }

    // Gender (multi-select)
    if (filters.gender && filters.gender.length > 0) {
      queryFilters.push({
        field: 'gender',
        operation: FilterOperation.IN,
        value: filters.gender,
      });
    }

    // Age Range
    if (filters.ageRange) {
      if (filters.ageRange.min !== undefined) {
        queryFilters.push({
          field: 'age',
          operation: FilterOperation.GREATER_THAN_OR_EQUALS,
          value: filters.ageRange.min,
        });
      }
      if (filters.ageRange.max !== undefined) {
        queryFilters.push({
          field: 'age',
          operation: FilterOperation.LESSER_THAN_OR_EQUALS,
          value: filters.ageRange.max,
        });
      }
    }

    // Product Category (multi-select)
    if (filters.productCategory && filters.productCategory.length > 0) {
      queryFilters.push({
        field: 'productCategory',
        operation: FilterOperation.IN,
        value: filters.productCategory,
      });
    }

    // Tags (multi-select) - Special handling for array field
    if (filters.tags && filters.tags.length > 0) {
      // For tags, we need to check if array contains any of the selected tags
      queryFilters.push({
        field: 'tags',
        operation: FilterOperation.ARRAY_HAS_SOME,
        value: filters.tags,
      });
    }

    // Payment Method (multi-select)
    if (filters.paymentMethod && filters.paymentMethod.length > 0) {
      queryFilters.push({
        field: 'paymentMethod',
        operation: FilterOperation.IN,
        value: filters.paymentMethod,
      });
    }

    // Date Range
    if (filters.dateRange) {
      if (filters.dateRange.from) {
        queryFilters.push({
          field: 'date',
          operation: FilterOperation.GREATER_THAN_OR_EQUALS,
          value: new Date(filters.dateRange.from),
        });
      }
      if (filters.dateRange.to) {
        queryFilters.push({
          field: 'date',
          operation: FilterOperation.LESSER_THAN_OR_EQUALS,
          value: new Date(filters.dateRange.to),
        });
      }
    }

    // Order Status (multi-select)
    if (filters.orderStatus && filters.orderStatus.length > 0) {
      queryFilters.push({
        field: 'orderStatus',
        operation: FilterOperation.IN,
        value: filters.orderStatus,
      });
    }

    return queryFilters;
  }
}
