// Shop Page - Main Product Listing

'use client';
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useMemo,useEffect } from 'react';
import { fetchProducts } from "@/lib/api";
import { Product } from "@/types/product";
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ProductFilter } from '@/components/shop/ProductFilter';
import { CategoryFilter } from '@/components/shop/ProductFilter';

import { Section } from '@/components/shared/Section';


export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  setLoading(true); // ✅ start loading

  fetchProducts()
    .then((data) => {
      setProducts(data);
    })
    .catch(console.error)
    .finally(() => {
      setLoading(false); // ✅ stop loading
    });
}, []);



  // Filter products based on selected category
const filteredProducts = useMemo(() => {
  if (activeFilter === "all") return products;
  return products.filter(p => p.category === activeFilter);
}, [activeFilter, products]);


  // Count products in each category
const filterOptions: {
  label: string;
  value: CategoryFilter;
  count: number;
}[] = [
  {
    label: 'All Products',
    value: 'all',
    count: products.length,
  },
  {
    label: 'Tableware',
    value: 'tableware',
    count: products.filter(p => p.category === 'tableware').length,
  },
  {
    label: 'Decor',
    value: 'decor',
    count: products.filter(p => p.category === 'decor').length,
  },
  {
    label: 'Custom',
    value: 'custom',
    count: products.filter(p => p.category === 'custom').length,
  },
];


  return (
    <main className="min-h-screen">
      {/* Hero Section */}{/* Hero */}
      <section className="relative h-[60vh] -mt-20 flex items-center justify-center text-center overflow-hidden">
        {/* Background Image Motion */}
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/Images/products/15.png"
            alt="Corporate pottery"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text Content */}
        <div className="relative z-10 text-white px-6">
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-5xl font-semibold mb-4"
          >
            SHOP COLLECTION
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-xl mx-auto text-white/80"
          >
            Handcrafted pieces for mindful living. Each item is thoughtfully created
      in our studio, inspired by Japanese aesthetics and the philosophy of
      wabi-sabi.
          </motion.p>
        </div>
      </section>


      {/* Products Section */}
      <Section>
        {/* Filter Tabs */}
        <ProductFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          filters={filterOptions}
        />

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-[320px] bg-gray-200 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        <ProductGrid 
          products={filteredProducts}
          emptyMessage="No products found in this category."
        />
      )}
      </Section>
      {/* Additional Info Section */}
      <Section bgColor="bg-[#D8CBC4]" className="py-16">
    <div className="grid md:grid-cols-3 gap-8 text-center max-w-6xl mx-auto">
          <div className="group bg-white/80 backdrop-blur rounded-2xl p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

            <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F0BF] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">

              <svg className="w-8 h-8 text-[#8B6F47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#2C2C2C] mb-2">Food-Safe Certified</h3>
            <p className="text-sm text-[#666]">
              All our pottery is made with food-safe, certified materials suitable for everyday use.
            </p>
          </div>

            <div className="group bg-white/80 backdrop-blur rounded-2xl p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F0BF] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">

              <svg className="w-8 h-8 text-[#8B6F47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#2C2C2C] mb-2">7-Day Returns</h3>
            <p className="text-sm text-[#666]">
              Not satisfied? Return within 7 days for a full refund. Your satisfaction is our priority.
            </p>
          </div>

            <div className="group bg-white/80 backdrop-blur rounded-2xl p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F0BF] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">

              <svg className="w-8 h-8 text-[#8B6F47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#2C2C2C] mb-2">Free Shipping</h3>
            <p className="text-sm text-[#666]">
              Enjoy free shipping on all orders over ₹3000. Carefully packaged for safe delivery.
            </p>
          </div>
        </div>
       
      </Section>
      
     <Section
  className="
    pt-0 
    pb-20 
    flex 
    items-center 
    min-h-[70vh] 
    lg:min-h-0
  "
>

  <div className="bg-linear-to-r from-[#4A5F55] to-[#5A7C6A] text-white rounded-2xl p-10 md:p-14 text-center max-w-6xl mx-auto shadow-xl">
    <h2 className="text-2xl md:text-3xl font-serif mb-4">
      Looking for Something Unique?
    </h2>
    <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
      We create custom pottery pieces tailored to your vision. From personalized dinnerware sets 
      to bespoke gifts, let's create something special together.
    </p>

<Link
  href="/custom-orders"
  className="
    inline-block
    bg-white 
    text-[#4A5F55] 
    px-8 
    py-3 
    rounded-md 
    font-medium 
    transition-all 
    duration-300 
    hover:bg-[#FAF8F5] 
    hover:scale-105
  "
>
  Request Custom Order
</Link>

  </div>
</Section>

    </main>
  );
}