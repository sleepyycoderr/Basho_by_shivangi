// Workshop Grid Component

'use client';

import React from 'react';
import { Workshop } from '@/types/workshop';
import { WorkshopCard } from './WorkshopCard';

interface WorkshopGridProps {
  workshops: Workshop[];
  emptyMessage?: string;
}

export const WorkshopGrid: React.FC<WorkshopGridProps> = ({ 
  workshops,
  emptyMessage = 'Workshops Are Coming Soon!', 
}) => {
  if (workshops.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-[#666]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {workshops.map((workshop) => (
        <WorkshopCard key={workshop.id} workshop={workshop} />
      ))}
    </div>
  );
};