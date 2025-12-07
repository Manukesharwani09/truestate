/**
 * Sort Dropdown Component
 */

import { useFilterStore } from '../store/useFilterStore';
import { SortDirection } from '../types';

const sortOptions = [
  { value: 'date-desc', label: 'Date (Newest First)', sortBy: 'date', sortDir: SortDirection.DESC },
  { value: 'date-asc', label: 'Date (Oldest First)', sortBy: 'date', sortDir: SortDirection.ASC },
  {
    value: 'quantity-desc',
    label: 'Quantity (High to Low)',
    sortBy: 'quantity',
    sortDir: SortDirection.DESC,
  },
  {
    value: 'quantity-asc',
    label: 'Quantity (Low to High)',
    sortBy: 'quantity',
    sortDir: SortDirection.ASC,
  },
  {
    value: 'customerName-asc',
    label: 'Customer Name (A-Z)',
    sortBy: 'customerName',
    sortDir: SortDirection.ASC,
  },
  {
    value: 'customerName-desc',
    label: 'Customer Name (Z-A)',
    sortBy: 'customerName',
    sortDir: SortDirection.DESC,
  },
];

export function SortDropdown() {
  const { sortBy, sortDir, setSorting } = useFilterStore();

  const currentValue = `${sortBy}-${sortDir}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = sortOptions.find((opt) => opt.value === e.target.value);
    if (option) {
      setSorting(option.sortBy, option.sortDir);
    }
  };

  return (
    <div className="relative inline-block">
      <select
        value={currentValue}
        onChange={handleChange}
        className="pl-4 pr-8 py-2 border border-primary-300 rounded-lg text-sm
                 text-primary-700 bg-white appearance-none cursor-pointer
                 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent
                 transition-all duration-200 font-medium"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            Sort by: {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary-600">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}
