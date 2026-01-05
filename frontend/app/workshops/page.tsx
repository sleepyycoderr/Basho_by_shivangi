// Workshops Page - Main Workshop Listing

'use client';
import { motion } from 'framer-motion';

import React, { useState, useMemo } from 'react';
import { workshops } from '@/data/workshops';
import { WorkshopGrid } from '@/components/workshops/WorkshopGrid';
import { WorkshopFilter } from '@/components/workshops/WorkshopFilter';
import { Section } from '@/components/shared/Section';

export default function WorkshopsPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter workshops based on selected type/level
  const filteredWorkshops = useMemo(() => {
    if (activeFilter === 'all') {
      return workshops;
    }
    if (activeFilter === 'group' || activeFilter === 'private' || activeFilter === 'experience') {
      return workshops.filter(workshop => workshop.type === activeFilter);
    }
    if (activeFilter === 'beginner' || activeFilter === 'intermediate' || activeFilter === 'advanced') {
      return workshops.filter(workshop => workshop.level === activeFilter);
    }
    return workshops;
  }, [activeFilter]);

  const filterOptions = [
    { label: 'All Workshops', value: 'all' },
    { label: 'Group Classes', value: 'group' },
    { label: 'Private Sessions', value: 'private' },
    { label: 'Experiences', value: 'experience' },
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Section className="relative overflow-hidden py-24 md:py-32 bg-[url('/images/products/12.png')] bg-cover bg-center">
  
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-[#3b3415]/70" />

  {/* Subtle animated gradient overlay */}
  <motion.div
    className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.2 }}
  />

  {/* Content */}
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: 'easeOut' }}
    className="relative text-center max-w-4xl mx-auto px-4"
  >
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.9 }}
      className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6"
    >
      Pottery Workshops
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.9 }}
      className="text-lg md:text-xl text-white/90 leading-relaxed mb-10"
    >
      Whether you're a complete beginner or looking to deepen your practice,
      our workshops offer a meditative escape into the world of clay. All
      sessions are led by Shivangi and include everything you need to create
      and take home your pieces.
    </motion.p>

    {/* CTA Button */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className="inline-block bg-white text-[#3b3415] px-8 py-3 rounded-sm font-medium tracking-wide shadow-lg hover:bg-[#FAF8F5] transition"
    >
      Explore Workshops
    </motion.button>
  </motion.div>
</Section>


      {/* Workshops Section */}
      <Section>
        {/* Filter Tabs */}
        <WorkshopFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          filters={filterOptions}
        />

        {/* Workshop Grid */}
        <WorkshopGrid 
          workshops={filteredWorkshops}
          emptyMessage="No workshops available for the selected filter."
        />
      </Section>

      {/* Private Experience Highlight */}
      <Section bgColor="bg-[#3D5A54]" className="text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-[#C9B896] mb-3 font-medium">
            Private Experience
          </p>
          <h2 className="text-3xl md:text-4xl font-serif mb-6">
            One-on-One Masterclass
          </h2>
          <p className="text-lg opacity-90 mb-8 leading-relaxed">
            Looking for a personalized experience? Book a private session tailored to your skill 
            level and interests. Perfect for focused learning, special occasions, or just quality 
            time with clay.
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">"Life-changing experience!" - Priya K.</span>
            </div>
          </div>
          <button className="bg-[#C9B896] text-[#2C2C2C] px-8 py-3 rounded-sm font-medium hover:bg-[#B8A785] transition-colors">
            Book Private Session
          </button>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section bgColor="bg-[#FAF8F5]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-[#2C2C2C] mb-12 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <details className="bg-white p-6 rounded-sm shadow-sm">
              <summary className="font-semibold text-[#2C2C2C] cursor-pointer text-lg">
                Do I need any prior experience?
              </summary>
              <p className="mt-4 text-[#666] leading-relaxed">
                Not at all! Our beginner workshops are designed for complete novices. We guide you 
                through every step.
              </p>
            </details>

            <details className="bg-white p-6 rounded-sm shadow-sm">
              <summary className="font-semibold text-[#2C2C2C] cursor-pointer text-lg">
                What should I wear?
              </summary>
              <p className="mt-4 text-[#666] leading-relaxed">
                Wear comfortable clothes that you don't mind getting a bit messy. We provide aprons, 
                but clay can be playful! Tie back long hair and avoid loose jewelry.
              </p>
            </details>

            <details className="bg-white p-6 rounded-sm shadow-sm">
              <summary className="font-semibold text-[#2C2C2C] cursor-pointer text-lg">
                When do I get my finished pieces?
              </summary>
              <p className="mt-4 text-[#666] leading-relaxed">
                Pieces need to dry and be fired twice. Plan for 3-4 weeks for pickup or shipping of 
                your creations.
              </p>
            </details>

            <details className="bg-white p-6 rounded-sm shadow-sm">
              <summary className="font-semibold text-[#2C2C2C] cursor-pointer text-lg">
                Can I book for a group or event?
              </summary>
              <p className="mt-4 text-[#666] leading-relaxed">
                Absolutely! We offer birthday parties, couples dates, and corporate workshops. 
                Contact us to customize your experience.
              </p>
            </details>
          </div>
        </div>
      </Section>
    </main>
  );
}