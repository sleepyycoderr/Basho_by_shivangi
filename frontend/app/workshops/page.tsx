// Workshops Page - Main Workshop Listing

"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { workshops as staticWorkshops } from "@/data/workshops";
import { fetchWorkshopsClient } from "@/lib/api";
import { WorkshopGrid } from "@/components/workshops/WorkshopGrid";
import { WorkshopFilter } from "@/components/workshops/WorkshopFilter";
import { Section } from "@/components/shared/Section";
import type { Workshop } from "@/types/workshop";
import Link from "next/link";

export default function WorkshopsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [workshopsData, setWorkshopsData] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true); 
  const workshopsSectionRef = useRef<HTMLDivElement>(null);

  const scrollToWorkshops = () => {
    workshopsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

useEffect(() => {
  const loadWorkshops = async () => {
    const start = Date.now();
    setLoading(true);

    try {
      const data = await fetchWorkshopsClient();

      if (Array.isArray(data)) {
        setWorkshopsData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      const elapsed = Date.now() - start;
      const minDelay = 250;

      setTimeout(
        () => setLoading(false),
        Math.max(0, minDelay - elapsed)
      );
    }
  };

  loadWorkshops();
}, []);


  // Filter workshops based on selected type/level
  const filteredWorkshops = useMemo(() => {
    if (activeFilter === "all") {
      return workshopsData;
    }

    if (["group", "private", "experience"].includes(activeFilter)) {
      return workshopsData.filter((w) => w.type === activeFilter);
    }

    if (["beginner", "intermediate", "advanced"].includes(activeFilter)) {
      return workshopsData.filter((w) => w.level === activeFilter);
    }

    return workshopsData;
  }, [activeFilter, workshopsData]);

  const filterOptions = [
    { label: "All Workshops", value: "all" },
    { label: "Group Classes", value: "group" },
    { label: "Private Sessions", value: "private" },
    { label: "Experiences", value: "experience" },
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[62vh] -mt-10 flex items-center justify-center text-center overflow-hidden">
        {/* Background Image Motion */}
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/Images/workshop-pieces/7.png"
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
            POTTERY WORKSHOPS
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-xl mx-auto text-white/80"
          >
            Whether you're a complete beginner or looking to deepen your
            practice, our workshops offer a meditative escape into the world of
            clay. All sessions are led by Shivangi and include everything you
            need to create and take home your pieces.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={scrollToWorkshops} // Add this line
            className="mt-8 inline-block bg-white text-[#3b3415] px-8 py-3 rounded-sm font-medium tracking-wide shadow-lg hover:bg-[#FAF8F5] transition"
          >
            Explore Workshops
          </motion.button>
        </div>
      </section>

      <div ref={workshopsSectionRef} className="scroll-mt-20">
        {/* Workshops Section */}
        <Section>
          {/* Filter Tabs */}
          <WorkshopFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            filters={filterOptions}
          />

        {/* Workshop Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[360px] bg-gray-200 animate-pulse rounded-sm"
              />
            ))}
          </div>
        ) : (
          <WorkshopGrid
            workshops={filteredWorkshops}
            emptyMessage="No workshops available for the selected filter."
          />
        )}

        </Section>
      </div>

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
            Looking for a personalized experience? Book a private session
            tailored to your skill level and interests. Perfect for focused
            learning, special occasions, or just quality time with clay.
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm">
                "Life-changing experience!" - Priya K.
              </span>
            </div>
          </div>
          <Link href="/experiences">
          <button className="bg-[#C9B896] text-[#2C2C2C] px-8 py-3 rounded-sm font-medium hover:bg-[#B8A785] transition-colors">
            Book Private Session
          </button>
          </Link>
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
                Not at all! Our beginner workshops are designed for complete
                novices. We guide you through every step.
              </p>
            </details>

            <details className="bg-white p-6 rounded-sm shadow-sm">
              <summary className="font-semibold text-[#2C2C2C] cursor-pointer text-lg">
                What should I wear?
              </summary>
              <p className="mt-4 text-[#666] leading-relaxed">
                Wear comfortable clothes that you don't mind getting a bit
                messy. We provide aprons, but clay can be playful! Tie back long
                hair and avoid loose jewelry.
              </p>
            </details>

            <details className="bg-white p-6 rounded-sm shadow-sm">
              <summary className="font-semibold text-[#2C2C2C] cursor-pointer text-lg">
                When do I get my finished pieces?
              </summary>
              <p className="mt-4 text-[#666] leading-relaxed">
                Pieces need to dry and be fired twice. Plan for 3-4 weeks for
                pickup or shipping of your creations.
              </p>
            </details>

            <details className="bg-white p-6 rounded-sm shadow-sm">
              <summary className="font-semibold text-[#2C2C2C] cursor-pointer text-lg">
                Can I book for a group or event?
              </summary>
              <p className="mt-4 text-[#666] leading-relaxed">
                Absolutely! We offer birthday parties, couples dates, and
                corporate workshops. Contact us to customize your experience.
              </p>
            </details>
          </div>
        </div>
      </Section>
    </main>
  );
}
