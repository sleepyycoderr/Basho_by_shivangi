// Reusable Button Component with Basho Design System

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, className, ...props }, ref) => {
    const baseStyles = 'font-medium transition-all duration-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-[#8B6F47] text-white hover:bg-[#6D5836] focus:ring-[#8B6F47]',
      secondary: 'bg-[#4A7C59] text-white hover:bg-[#3A6247] focus:ring-[#4A7C59]',
      outline: 'border-2 border-[#8B6F47] text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white focus:ring-[#8B6F47]',
      ghost: 'text-[#8B6F47] hover:bg-[#F5F5DC] focus:ring-[#8B6F47]',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';