/**
 * Filter Bar Component - Horizontal layout with badges
 */

import { ChevronDown, X, RotateCcw } from 'lucide-react';
import { useFilterStore } from '../store/useFilterStore';
import { useFilterOptions } from '../hooks/useSalesData';
import { useState, useRef, useEffect } from 'react';

export function FilterBar() {
  const { filters, setFilter, resetFilters } = useFilterStore();
  const { data: options, isLoading } = useFilterOptions();

  const hasActiveFilters =
    (filters.customerRegion?.length ?? 0) > 0 ||
    !!filters.gender ||
    (filters.productCategory?.length ?? 0) > 0 ||
    (filters.tags?.length ?? 0) > 0 ||
    (filters.paymentMethod?.length ?? 0) > 0 ||
    (filters.orderStatus?.length ?? 0) > 0 ||
    filters.dateRange?.from ||
    filters.dateRange?.to ||
    (filters.ageRange?.min !== undefined || filters.ageRange?.max !== undefined);

  if (isLoading || !options) {
    return null;
  }

  const toggleArrayFilter = (key: keyof typeof filters, value: string) => {
    const currentValues = (filters[key] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setFilter(key, newValues);
  };

  const removeFilter = (key: keyof typeof filters, value: string) => {
    const currentValues = (filters[key] as string[]) || [];
    const newValues = currentValues.filter((v) => v !== value);
    setFilter(key, newValues);
  };

  return (
    <div className="bg-white border-b border-primary-200">
      <div className="px-6 py-4">
        {/* Filter Dropdowns Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={resetFilters}
            className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
            title="Reset filters"
          >
            <RotateCcw className="h-4 w-4 text-primary-600" />
          </button>

          <FilterDropdown
            label="Customer Region"
            options={options.customerRegions}
            selected={filters.customerRegion || []}
            onToggle={(value) => toggleArrayFilter('customerRegion', value)}
          />

          <FilterDropdown
            label="Gender"
            options={options.genders}
            selected={filters.gender ? [filters.gender] : []}
            onToggle={(value) => setFilter('gender', filters.gender === value ? '' : value)}
            isSingleSelect
          />

          <FilterDropdown
            label="Age Range"
            options={[]}
            selected={[]}
            onToggle={() => {}}
            isAgeRange
            ageRange={filters.ageRange}
            onAgeRangeChange={(range) => setFilter('ageRange', range)}
            availableRange={options.ageRange}
          />

          <FilterDropdown
            label="Product Category"
            options={options.productCategories}
            selected={filters.productCategory || []}
            onToggle={(value) => toggleArrayFilter('productCategory', value)}
          />

          <FilterDropdown
            label="Tags"
            options={options.tags.slice(0, 10)}
            selected={filters.tags || []}
            onToggle={(value) => toggleArrayFilter('tags', value)}
          />

          <FilterDropdown
            label="Payment Method"
            options={options.paymentMethods}
            selected={filters.paymentMethod || []}
            onToggle={(value) => toggleArrayFilter('paymentMethod', value)}
          />

          <FilterDropdown
            label="Date"
            options={[]}
            selected={[]}
            onToggle={() => {}}
            isDateRange
            dateRange={filters.dateRange}
            onDateRangeChange={(range) => setFilter('dateRange', range)}
          />
        </div>

        {/* Selected Filters as Badges */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {filters.customerRegion?.map((region) => (
              <FilterBadge
                key={region}
                label={region}
                color="green"
                onRemove={() => removeFilter('customerRegion', region)}
              />
            ))}
            {filters.tags?.map((tag) => (
              <FilterBadge
                key={tag}
                label={tag}
                color={getTagColor(tag)}
                onRemove={() => removeFilter('tags', tag)}
              />
            ))}
            {filters.gender && (
              <FilterBadge
                label={filters.gender}
                color="blue"
                onRemove={() => setFilter('gender', '')}
              />
            )}
            {filters.productCategory?.map((category) => (
              <FilterBadge
                key={category}
                label={category}
                color="purple"
                onRemove={() => removeFilter('productCategory', category)}
              />
            ))}
            {filters.paymentMethod?.map((method) => (
              <FilterBadge
                key={method}
                label={method}
                color="orange"
                onRemove={() => removeFilter('paymentMethod', method)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  isAgeRange?: boolean;
  isDateRange?: boolean;
  isSingleSelect?: boolean;
  ageRange?: { min?: number; max?: number };
  dateRange?: { from?: string; to?: string };
  onAgeRangeChange?: (range: { min?: number; max?: number }) => void;
  onDateRangeChange?: (range: { from?: string; to?: string }) => void;
  availableRange?: { min: number; max: number };
}

function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
  isAgeRange,
  isDateRange,
  isSingleSelect,
  ageRange,
  dateRange,
  onAgeRangeChange,
  onDateRangeChange,
  availableRange,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
          selected.length > 0 || (ageRange?.min !== undefined) || (dateRange?.from)
            ? 'bg-accent-50 border-accent-300 text-accent-700'
            : 'bg-white border-primary-300 text-primary-700 hover:bg-primary-50'
        }`}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-primary-200 rounded-lg shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
          {isAgeRange && onAgeRangeChange && availableRange ? (
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs text-primary-600 mb-1">Min Age</label>
                <input
                  type="number"
                  min={1}
                  max={availableRange.max}
                  value={ageRange?.min !== undefined ? ageRange.min : 1}
                  onChange={(e) =>
                    onAgeRangeChange({
                      min: parseInt(e.target.value) || 1,
                      max: ageRange?.max !== undefined ? ageRange.max : 100
                    })
                  }
                  className="w-full px-3 py-2 border border-primary-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-primary-600 mb-1">Max Age</label>
                <input
                  type="number"
                  min={1}
                  max={availableRange.max}
                  value={ageRange?.max !== undefined ? ageRange.max : 100}
                  onChange={(e) =>
                    onAgeRangeChange({
                      min: ageRange?.min !== undefined ? ageRange.min : 1,
                      max: parseInt(e.target.value) || 100
                    })
                  }
                  className="w-full px-3 py-2 border border-primary-300 rounded-lg text-sm"
                />
              </div>
            </div>
          ) : isDateRange && onDateRangeChange ? (
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs text-primary-600 mb-1">From</label>
                <input
                  type="date"
                  value={dateRange?.from || ''}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    const today = new Date().toISOString().split('T')[0];
                    // Prevent future dates
                    if (selectedDate && selectedDate > today) {
                      onDateRangeChange({ ...dateRange, from: today });
                    } else {
                      onDateRangeChange({ ...dateRange, from: selectedDate });
                    }
                  }}
                  onBlur={(e) => {
                    const selectedDate = e.target.value;
                    const today = new Date().toISOString().split('T')[0];
                    // Validate on blur as well
                    if (selectedDate && selectedDate > today) {
                      onDateRangeChange({ ...dateRange, from: today });
                    }
                  }}
                  className="w-full px-3 py-2 border border-primary-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-primary-600 mb-1">To</label>
                <input
                  type="date"
                  value={dateRange?.to || ''}
                  min={dateRange?.from || undefined}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    const today = new Date().toISOString().split('T')[0];
                    const fromDate = dateRange?.from;

                    // Prevent future dates
                    if (selectedDate && selectedDate > today) {
                      onDateRangeChange({ ...dateRange, to: today });
                    }
                    // Prevent "to" being before "from"
                    else if (fromDate && selectedDate && selectedDate < fromDate) {
                      onDateRangeChange({ ...dateRange, to: fromDate });
                    } else {
                      onDateRangeChange({ ...dateRange, to: selectedDate });
                    }
                  }}
                  onBlur={(e) => {
                    const selectedDate = e.target.value;
                    const today = new Date().toISOString().split('T')[0];
                    const fromDate = dateRange?.from;

                    // Validate on blur
                    if (selectedDate && selectedDate > today) {
                      onDateRangeChange({ ...dateRange, to: today });
                    } else if (fromDate && selectedDate && selectedDate < fromDate) {
                      onDateRangeChange({ ...dateRange, to: fromDate });
                    }
                  }}
                  className="w-full px-3 py-2 border border-primary-300 rounded-lg text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="p-2">
              {options.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-primary-50 rounded cursor-pointer"
                >
                  <input
                    type={isSingleSelect ? "radio" : "checkbox"}
                    checked={selected.includes(option)}
                    onChange={() => onToggle(option)}
                    className="w-4 h-4 text-accent-600 border-primary-300 rounded"
                  />
                  <span className="text-sm text-primary-700">{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface FilterBadgeProps {
  label: string;
  color: string;
  onRemove: () => void;
}

function FilterBadge({ label, color, onRemove }: FilterBadgeProps) {
  const colors: Record<string, string> = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    cyan: 'bg-cyan-500',
    red: 'bg-red-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-sm font-medium ${colors[color] || colors.blue}`}
    >
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function getTagColor(tag: string): string {
  const colors = ['green', 'blue', 'purple', 'orange', 'cyan', 'red'];
  const index = tag.charCodeAt(0) % colors.length;
  return colors[index];
}
