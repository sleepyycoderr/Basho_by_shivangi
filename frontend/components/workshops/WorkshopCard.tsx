// Workshop Card Component

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Workshop } from '@/types/workshop';
import { formatPrice } from '@/lib/utils';

interface WorkshopCardProps {
  workshop: Workshop;
}

export const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop }) => {
  // Get the nearest available date
  const nearestDate = workshop.schedule.find(s => s.isAvailable);
  
  // Calculate total available spots across all dates
  const totalAvailableSpots = workshop.schedule
    .filter(s => s.isAvailable)
    .reduce((sum, s) => sum + s.availableSpots, 0);

  return (
    <div className="group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Workshop Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-[#F5F5DC]">
        <Image
          src={workshop.images[0]}
          alt={workshop.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#8B6F47]">
            {workshop.type}
          </span>
          <span className="bg-[#4A7C59] px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
            {workshop.level}
          </span>
        </div>

        {/* Featured Badge */}
        {workshop.featured && (
          <div className="absolute top-4 right-4 bg-[#8B6F47] text-white px-3 py-1 text-xs font-medium uppercase tracking-wide">
            Popular
          </div>
        )}
      </div>

      {/* Workshop Info */}
      <div className="p-6">
        {/* Workshop Name */}
        <h3 className="text-xl font-serif text-[#2C2C2C] mb-2 group-hover:text-[#8B6F47] transition-colors">
          {workshop.name}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-[#666] mb-4 line-clamp-2">
          {workshop.description}
        </p>

        {/* Workshop Details */}
        <div className="space-y-2 mb-4">
          {/* Duration and Participants */}
          <div className="flex items-center gap-4 text-sm text-[#666]">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{workshop.duration}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>
                {workshop.participants.min === workshop.participants.max 
                  ? `${workshop.participants.min} participant${workshop.participants.min > 1 ? 's' : ''}`
                  : `${workshop.participants.min}-${workshop.participants.max} participants`
                }
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-[#666]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Basho Studio</span>
          </div>
        </div>

        {/* Key Features - show 3 items from includes */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {workshop.includes.slice(0, 3).map((item, index) => (
              <span
                key={index}
                className="text-xs bg-[#F5F5DC] text-[#666] px-2 py-1 rounded-full"
              >
                ✓ {item}
              </span>
            ))}
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-end justify-between pt-4 border-t border-[#E5E5E5]">
          <div>
            <p className="text-sm text-[#666] mb-1">
              {workshop.pricePerPerson ? 'per person' : 'total'}
            </p>
            <p className="text-2xl font-semibold text-[#8B6F47]">
              {formatPrice(workshop.price)}
            </p>
          </div>
          
          <Link
            href={`/workshops/${workshop.id}`}
            className="bg-[#8B6F47] text-white px-6 py-2.5 rounded-sm text-sm font-medium hover:bg-[#6D5836] transition-colors"
          >
            View Details →
          </Link>
        </div>

        {/* Availability indicator */}
        {totalAvailableSpots > 0 && totalAvailableSpots < 10 && (
          <p className="text-xs text-orange-600 mt-3">
            {totalAvailableSpots} spots remaining
          </p>
        )}
      </div>
    </div>
  );
};