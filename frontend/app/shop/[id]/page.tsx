// Individual Product Detail Page

'use client';
import { useCart } from '@/context/CartContext';
import { useEffect } from 'react';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById, getProductsByCategory } from '@/data/products';
import { ProductCard } from '@/components/shop/ProductCard';
import { formatPrice, calculateShipping } from '@/lib/utils';
import { GlazeColor } from '@/types/product';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = getProductById(productId);
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<GlazeColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [openSections, setOpenSections] = useState({
    dimensions: true,
    care: false,
    shipping: false,
  });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-[#2C2C2C] mb-4">Product Not Found</h1>
          <Link href="/shop" className="text-[#8B6F47] hover:underline">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Set default selected color
  useEffect(() => {
  if (!selectedColor && product.availableColors.length > 0) {
    setSelectedColor(product.availableColors[0]);
  }
}, [product, selectedColor]);
   const handleAddToCart = () => {
    if (!product || !selectedColor) return;
    
    addToCart(product, quantity, selectedColor);
    setShowAddedMessage(true);
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setShowAddedMessage(false);
    }, 3000);
  };
  // Get related products
  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 3);

  const toggleSection = (section: 'dimensions' | 'care' | 'shipping') => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, product.stock));
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  const shippingCost = calculateShipping(product.weight * quantity);

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-sm text-[#666]">
          <Link href="/" className="hover:text-[#8B6F47]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#8B6F47]">Shop</Link>
          <span>/</span>
          <span className="text-[#2C2C2C]">{product.name}</span>
        </nav>
      </div>

      {/* Product Detail Section */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square bg-[#F5F5DC] rounded-sm overflow-hidden mb-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-[#F5F5DC] rounded-sm overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-[#8B6F47]'
                        : 'border-transparent hover:border-[#D4C5B0]'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div>
            {/* Category */}
            <p className="text-xs uppercase tracking-widest text-[#8B6F47] mb-3 font-medium">
              {product.category}
            </p>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-serif text-[#2C2C2C] mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl font-semibold text-[#8B6F47]">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm text-[#666] mt-1">Inclusive of all taxes</p>
            </div>

            {/* Long Description */}
            <p className="text-[#666] leading-relaxed mb-8">
              {product.longDescription || product.description}
            </p>

            {/* Color Selection */}
            {product.availableColors.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm uppercase tracking-widest text-[#666] mb-4">
                  Select Glaze: {selectedColor?.name.toUpperCase()}
                </label>
                <div className="flex gap-3">
                  {product.availableColors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor?.code === color.code
                          ? 'border-[#8B6F47] ring-2 ring-[#8B6F47] ring-offset-2'
                          : 'border-gray-300 hover:border-[#8B6F47]'
                      }`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    >
                      {selectedColor?.code === color.code && (
                        <svg
                          className="w-6 h-6 mx-auto text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm uppercase tracking-widest text-[#666] mb-4">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-[#D4C5B0] rounded-sm">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="px-6 py-3 text-[#8B6F47] hover:bg-[#FAF8F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    −
                  </button>
                  <span className="px-8 py-3 text-[#2C2C2C] font-medium border-x-2 border-[#D4C5B0]">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="px-6 py-3 text-[#8B6F47] hover:bg-[#FAF8F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    +
                  </button>
                </div>
                {product.stock < 10 && (
                  <p className="text-sm text-orange-600">
                    Only {product.stock} left in stock
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 mb-8">
              <button
                    onClick={handleAddToCart}
                   className="w-full bg-[#8B6F47] text-white py-4 rounded-sm font-medium hover:bg-[#6D5836] transition-colors uppercase tracking-wide"
                    disabled={product.stock === 0}
>                   {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
                {showAddedMessage && (
                <div className="text-green-700 bg-green-100 border border-green-300 px-4 py-3 rounded-sm text-center">
            ✅ Item added to cart successfully
              </div>
            )}
            </div>

            {/* Features Icons */}
            <div className="grid grid-cols-3 gap-6 py-8 border-y border-[#E5E5E5] mb-8">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <svg className="w-8 h-8 text-[#8B6F47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <p className="text-sm text-[#666]">
                  Free shipping over ₹3000
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <svg className="w-8 h-8 text-[#8B6F47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-[#666]">Food-safe certified</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <svg className="w-8 h-8 text-[#8B6F47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p className="text-sm text-[#666]">7-day returns</p>
              </div>
            </div>

            {/* Expandable Sections */}
            <div className="space-y-4">
              {/* Dimensions & Materials */}
              <div className="border-b border-[#E5E5E5]">
                <button
                  onClick={() => toggleSection('dimensions')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="text-sm uppercase tracking-widest text-[#2C2C2C] font-medium">
                    Dimensions & Materials
                  </span>
                  <svg
                    className={`w-5 h-5 text-[#8B6F47] transition-transform ${
                      openSections.dimensions ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSections.dimensions && (
                  <div className="pb-6 text-[#666] space-y-2">
                    {product.dimensions && (
                      <p>
                        <strong className="text-[#2C2C2C]">Dimensions:</strong>{' '}
                        {product.dimensions.diameter && `Ø ${product.dimensions.diameter}`}
                        {product.dimensions.diameter && product.dimensions.height && ' × '}
                        {product.dimensions.height && `H ${product.dimensions.height}`}
                        {product.dimensions.capacity && ` (${product.dimensions.capacity})`}
                      </p>
                    )}
                    <p>
                      <strong className="text-[#2C2C2C]">Materials:</strong>{' '}
                      {product.materials.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Care Instructions */}
              <div className="border-b border-[#E5E5E5]">
                <button
                  onClick={() => toggleSection('care')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="text-sm uppercase tracking-widest text-[#2C2C2C] font-medium">
                    Care Instructions
                  </span>
                  <svg
                    className={`w-5 h-5 text-[#8B6F47] transition-transform ${
                      openSections.care ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSections.care && (
                  <div className="pb-6 text-[#666] space-y-2">
                    {product.isMicrowaveSafe && (
                      <p className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Microwave safe
                      </p>
                    )}
                    {product.isDishwasherSafe && (
                      <p className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Dishwasher safe (top rack)
                      </p>
                    )}
                    {product.careInstructions.map((instruction, index) => (
                      <p key={index} className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {instruction}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div className="border-b border-[#E5E5E5]">
                <button
                  onClick={() => toggleSection('shipping')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="text-sm uppercase tracking-widest text-[#2C2C2C] font-medium">
                    Shipping & Returns
                  </span>
                  <svg
                    className={`w-5 h-5 text-[#8B6F47] transition-transform ${
                      openSections.shipping ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSections.shipping && (
                  <div className="pb-6 text-[#666] space-y-3">
                    <p>
                      Ships within 3-5 business days. Free shipping on orders over ₹3000. 7-day return
                      policy for undamaged items. Shipping calculated by weight.
                    </p>
                    <p>
                      <strong className="text-[#2C2C2C]">Estimated shipping:</strong>{' '}
                      {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-serif text-[#2C2C2C] mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}