/**
 * Filter Panel Component
 */

import { Filter, X } from 'lucide-react';
import { useFilterStore } from '../store/useFilterStore';
import { useFilterOptions } from '../hooks/useSalesData';

export function FilterPanel() {
  const { filters, setFilter, resetFilters } = useFilterStore();
  const { data: options, isLoading } = useFilterOptions();

  if (isLoading || !options) {
    return (
      <div className="bg-white rounded-lg border border-primary-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-primary-200 rounded w-3/4"></div>
          <div className="h-4 bg-primary-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const toggleArrayFilter = (key: keyof typeof filters, value: string) => {
    const currentValues = (filters[key] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setFilter(key, newValues);
  };

  const hasActiveFilters =
    (filters.customerRegion?.length ?? 0) > 0 ||
    !!filters.gender ||
    (filters.productCategory?.length ?? 0) > 0 ||
    (filters.tags?.length ?? 0) > 0 ||
    (filters.paymentMethod?.length ?? 0) > 0 ||
    (filters.orderStatus?.length ?? 0) > 0 ||
    filters.dateRange?.from ||
    filters.dateRange?.to;

  return (
    <div className="bg-white rounded-lg border border-primary-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-primary-200">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-primary-900">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-sm text-accent-600 hover:text-accent-700 font-medium flex items-center gap-1
                     transition-colors duration-200"
          >
            <X className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Content */}
      <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
        {/* Customer Region */}
        <FilterSection title="Customer Region">
          <CheckboxGroup
            options={options.customerRegions}
            selected={filters.customerRegion || []}
            onChange={(value) => toggleArrayFilter('customerRegion', value)}
          />
        </FilterSection>

        {/* Gender */}
        <FilterSection title="Gender">
          <RadioGroup
            options={options.genders}
            selected={filters.gender || ''}
            onChange={(value) => setFilter('gender', value)}
          />
        </FilterSection>

        {/* Age Range */}
        <FilterSection title="Age Range">
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-primary-600 mb-1">Min Age</label>
              <input
                type="number"
                min={options.ageRange.min}
                max={options.ageRange.max}
                value={filters.ageRange?.min || options.ageRange.min}
                onChange={(e) =>
                  setFilter('ageRange', {
                    ...filters.ageRange,
                    min: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-primary-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <div>
              <label className="block text-xs text-primary-600 mb-1">Max Age</label>
              <input
                type="number"
                min={options.ageRange.min}
                max={options.ageRange.max}
                value={filters.ageRange?.max || options.ageRange.max}
                onChange={(e) =>
                  setFilter('ageRange', {
                    ...filters.ageRange,
                    max: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-primary-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
          </div>
        </FilterSection>

        {/* Product Category */}
        <FilterSection title="Product Category">
          <CheckboxGroup
            options={options.productCategories}
            selected={filters.productCategory || []}
            onChange={(value) => toggleArrayFilter('productCategory', value)}
          />
        </FilterSection>

        {/* Tags */}
        <FilterSection title="Tags">
          <CheckboxGroup
            options={options.tags.slice(0, 10)} // Show first 10 tags
            selected={filters.tags || []}
            onChange={(value) => toggleArrayFilter('tags', value)}
          />
        </FilterSection>

        {/* Payment Method */}
        <FilterSection title="Payment Method">
          <CheckboxGroup
            options={options.paymentMethods}
            selected={filters.paymentMethod || []}
            onChange={(value) => toggleArrayFilter('paymentMethod', value)}
          />
        </FilterSection>

        {/* Date Range */}
        <FilterSection title="Date Range">
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-primary-600 mb-1">From</label>
              <input
                type="date"
                value={filters.dateRange?.from || ''}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  const today = new Date().toISOString().split('T')[0];
                  // Prevent future dates
                  if (selectedDate && selectedDate > today) {
                    setFilter('dateRange', {
                      ...filters.dateRange,
                      from: today,
                    });
                  } else {
                    setFilter('dateRange', {
                      ...filters.dateRange,
                      from: selectedDate,
                    });
                  }
                }}
                onBlur={(e) => {
                  const selectedDate = e.target.value;
                  const today = new Date().toISOString().split('T')[0];
                  // Validate on blur
                  if (selectedDate && selectedDate > today) {
                    setFilter('dateRange', {
                      ...filters.dateRange,
                      from: today,
                    });
                  }
                }}
                className="w-full px-3 py-2 border border-primary-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <div>
              <label className="block text-xs text-primary-600 mb-1">To</label>
              <input
                type="date"
                value={filters.dateRange?.to || ''}
                min={filters.dateRange?.from || undefined}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  const today = new Date().toISOString().split('T')[0];
                  const fromDate = filters.dateRange?.from;

                  // Prevent future dates
                  if (selectedDate && selectedDate > today) {
                    setFilter('dateRange', {
                      ...filters.dateRange,
                      to: today,
                    });
                  }
                  // Prevent "to" being before "from"
                  else if (fromDate && selectedDate && selectedDate < fromDate) {
                    setFilter('dateRange', {
                      ...filters.dateRange,
                      to: fromDate,
                    });
                  } else {
                    setFilter('dateRange', {
                      ...filters.dateRange,
                      to: selectedDate,
                    });
                  }
                }}
                onBlur={(e) => {
                  const selectedDate = e.target.value;
                  const today = new Date().toISOString().split('T')[0];
                  const fromDate = filters.dateRange?.from;

                  // Validate on blur
                  if (selectedDate && selectedDate > today) {
                    setFilter('dateRange', {
                      ...filters.dateRange,
                      to: today,
                    });
                  } else if (fromDate && selectedDate && selectedDate < fromDate) {
                    setFilter('dateRange', {
                      ...filters.dateRange,
                      to: fromDate,
                    });
                  }
                }}
                className="w-full px-3 py-2 border border-primary-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
          </div>
        </FilterSection>

        {/* Order Status */}
        <FilterSection title="Order Status">
          <CheckboxGroup
            options={options.orderStatuses}
            selected={filters.orderStatus || []}
            onChange={(value) => toggleArrayFilter('orderStatus', value)}
          />
        </FilterSection>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-primary-900">{title}</h3>
      {children}
    </div>
  );
}

interface CheckboxGroupProps {
  options: string[];
  selected: string[];
  onChange: (value: string) => void;
}

function CheckboxGroup({ options, selected, onChange }: CheckboxGroupProps) {
  return (
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onChange(option)}
            className="w-4 h-4 text-accent-600 border-primary-300 rounded
                     focus:ring-2 focus:ring-accent-500 focus:ring-offset-0
                     cursor-pointer transition-colors"
          />
          <span className="text-sm text-primary-700 group-hover:text-primary-900 transition-colors">
            {option}
          </span>
        </label>
      ))}
    </div>
  );
}

interface RadioGroupProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

function RadioGroup({ options, selected, onChange }: RadioGroupProps) {
  return (
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            checked={selected === option}
            onChange={() => onChange(option)}
            className="w-4 h-4 text-accent-600 border-primary-300
                     focus:ring-2 focus:ring-accent-500 focus:ring-offset-0
                     cursor-pointer transition-colors"
          />
          <span className="text-sm text-primary-700 group-hover:text-primary-900 transition-colors">
            {option}
          </span>
        </label>
      ))}
    </div>
  );
}
