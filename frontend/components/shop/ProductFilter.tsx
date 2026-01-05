// Product Filter Component

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface ProductFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filters: FilterOption[];
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  activeFilter,
  onFilterChange,
  filters,
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            'px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
            activeFilter === filter.value
              ? 'bg-[#8B6F47] text-white shadow-md'
              : 'bg-white text-[#8B6F47] border border-[#D4C5B0] hover:border-[#8B6F47] hover:bg-[#FAF8F5]'
          )}
        >
          {filter.label}
          {filter.count !== undefined && (
            <span className="ml-2 text-xs opacity-75">({filter.count})</span>
          )}
        </button>
      ))}
    </div>
  );
};