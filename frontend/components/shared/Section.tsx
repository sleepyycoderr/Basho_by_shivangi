// Reusable Section Component for consistent page layout

import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  bgColor?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  containerClassName,
  bgColor = 'bg-[#FAF8F5]',
}) => {
  return (
    <section className={cn('py-16 md:py-24', bgColor, className)}>
      <div className={cn('container mx-auto px-4 md:px-6 lg:px-8', containerClassName)}>
        {children}
      </div>
    </section>
  );
};