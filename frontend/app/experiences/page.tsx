"use client";

import ExperienceSection from "./components/ExperienceSection";
import styles from "./Experiences.module.css";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ExperiencesPage() {
  return (
    <main className={styles.wrapper}>
      {/*<div className={styles.hero}>   
      <h1 className={styles.heroTitle}>CHOOSE YOUR EXPERIENCE</h1>
        <p className={styles.subheading}>
            From romantic dates to joyful celebrations, we craft experiences as
            unique as the pottery you’ll create.
        </p>
      </div>*/}
          
{/* Hero */}
      <section className="relative h-[60vh] -mt-20 flex items-center justify-center text-center overflow-hidden">
        {/* Background Image Motion */}
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/images/workshop-pieces/12.png"
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
            CHOOSE YOUR EXPERIENCE
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-xl mx-auto text-white/80"
          >
            From romantic dates to joyful celebrations, we craft experiences as
            unique as the pottery you’ll create.
          </motion.p>
        </div>
      </section>
      <ExperienceSection
        experienceId={1}
        title="Couple’s Pottery Date"
        tagline="Create together, bond forever"
        description="An intimate pottery session for couples. Shape clay together and take home matching pieces."
        image="/experiences/couple.png"
        duration="2.5 hours"
        people="2 people"
        price="₹3,500"
        includes={[
          "Private studio space",
          "Expert guidance",
          "All materials",
          "2 finished pieces",
        ]}
      />

      <ExperienceSection
        experienceId={2}
        title="Birthday Celebrations"
        tagline="Celebrate with clay & laughter"
        description="A joyful pottery party designed for birthdays—fun, creative, and memorable."
        image="/experiences/birthday.png"
        duration="3 hours"
        people="6–10 people"
        price="₹6,500"
        includes={[
          "Decorated studio",
          "Guided session",
          "Refreshments",
          "Group keepsakes",
        ]}
        reverse
      />

      <ExperienceSection
        experienceId={3}
        title="Farm & Garden Mini Parties"
        tagline="Nature, clay & connection"
        description="Pottery sessions hosted in farm or garden settings for a relaxed, earthy celebration."
        image="/experiences/garden.png"
        duration="3 hours"
        people="8–12 people"
        price="₹8,000"
        includes={[
          "Outdoor setup",
          "Natural clay",
          "Guided activity",
          "Light refreshments",
        ]}
      />

      <ExperienceSection
        experienceId={4}
        title="Studio-Based Experiences"
        tagline="Learn, explore, create"
        description="Structured studio workshops for individuals or small groups to deepen pottery skills."
        image="/experiences/privatestudio.png"
        duration="2 hours"
        people="1–4 people"
        price="₹2,000"
        includes={[
          "Studio access",
          "Skill-based guidance",
          "Materials",
          "Finished piece",
        ]}
        reverse
      />
    </main>
  );
}
