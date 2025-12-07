/**
 * Sales Controller
 * Handles HTTP requests for sales endpoints
 */

import { Request, Response } from 'express';
import { SalesService } from '../services/sales.service';
import { QueryBuilderRequest, SortDirection } from '../types/queryBuilder.types';
import { SaleFilters } from '../types/sale.types';

export class SalesController {
  /**
   * GET /api/sales
   * Get sales with search, filter, sort, and pagination
   */
  static async getSales(req: Request, res: Response): Promise<void> {
    try {
      // Parse request body parameters
      const currentPage = req.body.currentPage || 0;
      const pageSize = Math.min(req.body.pageSize || 10, 100); // Max 100 items per page
      const searchPhrase = req.body.searchPhrase;
      const sortBy = req.body.sortBy || 'date';
      const sortDir = req.body.sortDir || SortDirection.DESC;

      // Parse filters from request body
      const filters: SaleFilters = req.body.filters || {};

      // Build query request
      const queryRequest: QueryBuilderRequest = {
        currentPage,
        pageSize,
        searchPhrase,
        searchOn: searchPhrase ? ['customerName', 'phoneNumber'] : undefined,
        sortBy,
        sortDir,
        filters: SalesService.convertFiltersToQueryBuilder(filters),
      };

      const result = await SalesService.getSales(queryRequest);

      res.json(result);
    } catch (error) {
      console.error('Error fetching sales:', error);
      res.status(500).json({
        error: 'Failed to fetch sales data',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/sales/filters
   * Get available filter options
   */
  static async getFilterOptions(_req: Request, res: Response): Promise<void> {
    try {
      const options = await SalesService.getFilterOptions();
      res.json(options);
    } catch (error) {
      console.error('Error fetching filter options:', error);
      res.status(500).json({
        error: 'Failed to fetch filter options',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/sales/stats
   * Get sales statistics with optional filters
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const filters: SaleFilters = req.body.filters || {};
      const queryFilters = SalesService.convertFiltersToQueryBuilder(filters);
      const searchPhrase = req.body.searchPhrase;
      const searchOn = searchPhrase ? ['customerName', 'phoneNumber'] : undefined;

      const stats = await SalesService.getSalesStats(queryFilters, searchPhrase, searchOn);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({
        error: 'Failed to fetch statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
