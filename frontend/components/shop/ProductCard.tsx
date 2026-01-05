// Product Card Component for Shop Grid

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link 
      href={`/shop/${product.id}`}
      className="group block bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-[#F5F5DC]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badge for featured or custom products */}
        {product.featured && (
          <div className="absolute top-4 left-4 bg-[#8B6F47] text-white px-3 py-1 text-xs font-medium uppercase tracking-wide">
            Featured
          </div>
        )}
        
        {product.isCustomizable && (
          <div className="absolute top-4 right-4 bg-white text-[#8B6F47] px-3 py-1 text-xs font-medium uppercase tracking-wide">
            Customizable
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        <p className="text-xs uppercase tracking-widest text-[#8B6F47] mb-2 font-medium">
          {product.category}
        </p>
        
        {/* Product Name */}
        <h3 className="text-lg font-serif text-[#2C2C2C] mb-2 group-hover:text-[#8B6F47] transition-colors">
          {product.name}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-[#666] mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* Color Options - show small dots */}
        {product.availableColors.length > 0 && (
          <div className="flex gap-2 mb-3">
            {product.availableColors.map((color, index) => (
              <div
                key={index}
                className="w-5 h-5 rounded-full border-2 border-gray-200"
                style={{ backgroundColor: color.code }}
                title={color.name}
              />
            ))}
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-semibold text-[#8B6F47]">
            {formatPrice(product.price)}
          </span>
          
          {/* Stock indicator */}
          {product.stock < 5 && product.stock > 0 && (
            <span className="text-xs text-orange-600">
              Only {product.stock} left
            </span>
          )}
          
          {product.stock === 0 && (
            <span className="text-xs text-red-600 font-medium">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};