"use client";

import { useEffect, useState } from "react";
import ExperienceSection from "./components/ExperienceSection";
import styles from "./Experiences.module.css";
import { motion } from "framer-motion";
import Image from "next/image";

interface Experience {
  id: number;
  title: string;
  tagline: string;
  description: string;
  duration: string;
  people: string;
  price: number;
  image: string;
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/experiences/")
      .then((res) => res.json())
      .then((data) => {
        setExperiences(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className={styles.wrapper}>
      {/* HERO */}
      <section className="relative h-[60vh] -mt-20 flex items-center justify-center text-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/images/workshop-pieces/12.png"
            alt="Experiences"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-white px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-5xl font-semibold mb-4"
          >
            CHOOSE YOUR EXPERIENCE
          </motion.h1>

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

      {/* LOADING */}
      {loading && (
        <p className="text-center py-20 text-gray-500">
          Loading experiences...
        </p>
      )}

      {/* EMPTY STATE */}
      {!loading && experiences.length === 0 && (
        <p className="text-center py-20 text-gray-500">
          No experiences available right now.
        </p>
      )}

      {/* EXPERIENCES FROM BACKEND */}
      {experiences.map((exp, index) => (
        <ExperienceSection
          key={exp.id}
          experienceId={exp.id}
          title={exp.title}
          tagline={exp.tagline}
          description={exp.description}
          image={exp.image}
          duration={exp.duration}
          people={exp.people}
          price={`₹${exp.price}`}
          includes={[
            "Expert guidance",
            "All materials included",
            "Finished pottery pieces",
          ]}
          reverse={index % 2 !== 0}
        />
      ))}
    </main>
  );
}
