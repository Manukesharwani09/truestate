/**
 * Search Bar Component
 */

import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFilterStore } from '../store/useFilterStore';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useFilterStore();
  const [localValue, setLocalValue] = useState(searchQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, setSearchQuery]);

  return (
    <div className="relative w-80">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-primary-400" />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Name, Phone no."
        className="block w-full pl-10 pr-3 py-2 border border-primary-300 rounded-lg text-sm
                 text-primary-900 placeholder-primary-400
                 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent
                 transition-all duration-200"
      />
    </div>
  );
}
