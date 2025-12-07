/**
 * Dashboard Page
 * Main application page with all components
 */

import { Info } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { SearchBar } from '../components/SearchBar';
import { SortDropdown } from '../components/SortDropdown';
import { FilterBar } from '../components/FilterBar';
import { SalesTable } from '../components/SalesTable';
import { Pagination } from '../components/Pagination';
import { useSalesData, useStats } from '../hooks/useSalesData';

export function Dashboard() {
  const { data: salesData, isLoading, error } = useSalesData();
  const { data: stats } = useStats();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-primary-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-primary-900">
              Sales Management System
            </h1>
            <div className="flex items-center gap-4">
              <SearchBar />
              <SortDropdown />
            </div>
          </div>
        </header>

        {/* Filter Bar */}
        <FilterBar />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            {/* Stats Cards */}
            {stats && stats.totalUnitsSold !== undefined && (
              <div className="flex gap-4 mb-6">
                <StatsCard
                  title="Total units sold"
                  value={stats.totalUnitsSold}
                  subtitle={`${stats.totalSalesRecords} SRs`}
                />
                <StatsCard
                  title="Total Amount"
                  value={`₹${(stats.totalAmount || 0).toLocaleString('en-IN')}`}
                  subtitle={`${stats.totalSalesRecords} SRs`}
                />
                <StatsCard
                  title="Total Discount"
                  value={`₹${(stats.totalDiscount || 0).toLocaleString('en-IN')}`}
                  subtitle={`${stats.totalSalesRecords} SRs`}
                />
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="bg-white rounded-lg border border-primary-200 p-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
                  <p className="mt-4 text-primary-600">Loading sales data...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
                <p className="text-red-600 text-sm">
                  {error instanceof Error ? error.message : 'Failed to load sales data'}
                </p>
              </div>
            )}

            {/* Sales Table */}
            {salesData && !isLoading && (
              <>
                {salesData.data.length === 0 ? (
                  <div className="bg-white rounded-lg border border-primary-200 p-12">
                    <div className="text-center">
                      <p className="text-primary-600 text-lg">No sales found</p>
                      <p className="text-primary-500 text-sm mt-2">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <SalesTable sales={salesData.data} />
                    <Pagination
                      totalPages={salesData.totalPages}
                      totalElements={salesData.totalElements}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

function StatsCard({ title, value, subtitle }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-primary-200 p-4 min-w-fit">
      <div className="flex items-start gap-2 mb-2">
        <h3 className="text-sm font-medium text-primary-600 whitespace-nowrap">{title}</h3>
        <Info className="h-4 w-4 text-primary-400 flex-shrink-0" />
      </div>
      <p className="text-xl font-bold text-primary-900 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-primary-500">({subtitle})</p>}
    </div>
  );
}
