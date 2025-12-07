/**
 * Pagination Component
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFilterStore } from '../store/useFilterStore';

interface PaginationProps {
  totalPages: number;
  totalElements: number;
}

export function Pagination({ totalPages, totalElements }: PaginationProps) {
  const { currentPage, setCurrentPage } = useFilterStore();

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const startItem = currentPage * 10 + 1;
  const endItem = Math.min((currentPage + 1) * 10, totalElements);

  return (
    <div className="flex items-center justify-between border-t border-primary-200 bg-white px-6 py-4 rounded-b-lg">
      <div className="flex items-center text-sm text-primary-600">
        Showing <span className="font-medium mx-1">{startItem}</span> to{' '}
        <span className="font-medium mx-1">{endItem}</span> of{' '}
        <span className="font-medium mx-1">{totalElements.toLocaleString()}</span> results
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          className="inline-flex items-center px-3 py-2 border border-primary-300 rounded-lg
                   text-sm font-medium text-primary-700 bg-white
                   hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>

        <div className="flex items-center gap-1">
          <span className="text-sm text-primary-600">
            Page {currentPage + 1} of {totalPages}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages - 1}
          className="inline-flex items-center px-3 py-2 border border-primary-300 rounded-lg
                   text-sm font-medium text-primary-700 bg-white
                   hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
