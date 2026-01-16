"use client";

import { useEffect, useRef, useState } from "react";
import ExperienceSection from "./components/ExperienceSection";
import styles from "./Experiences.module.css";
import { motion } from "framer-motion";
import Image from "next/image";

interface ExperienceImage {
  url: string;
  alt?: string;
}

interface Experience {
  id: number;
  title: string;
  tagline: string;
  description: string;
  duration: string;
  people: string;
  price: number;
  image: ExperienceImage[]; // ✅ JSON array
}


export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/experiences/")
      .then((res) => res.json())
      .then((data) => {
        setExperiences(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

 useEffect(() => {
  if (bookingSuccess) {
    successRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [bookingSuccess]);


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
      {/* LOADING */}
{loading && (
  <div className="flex flex-col items-center justify-center py-24">
    <div className="w-10 h-10 border-4 border-[#D4C5B0] border-t-[#8B6F47] rounded-full animate-spin mb-4" />
    <p className="text-sm tracking-wide text-[#777]">
      Loading experiences…
    </p>
  </div>
)}


      {/* EMPTY STATE */}
      {!loading && experiences.length === 0 && (
        <p className="text-center py-20 text-gray-500">
          No experiences available right now.
        </p>
      )}

      {/* EXPERIENCES FROM BACKEND */}


      {bookingSuccess && (
        <div ref={successRef} className="text-center py-10 bg-green-50 text-green-800">
          <h3 className="text-xl font-semibold">Booking Confirmed 🎉</h3>
          <p>Your experience has been successfully booked.</p>
        </div>
      )}


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
          onBookingSuccess={() => setBookingSuccess(true)}
        />
      ))}
    </main>
  );
}