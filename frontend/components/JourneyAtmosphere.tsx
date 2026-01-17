"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function JourneyAtmosphere() {
  const { scrollYProgress } = useScroll();

  const glowY = useTransform(scrollYProgress, [0.15, 0.6], ["0%", "35%"]);
  const glowOpacity = useTransform(scrollYProgress, [0.15, 0.4], [0.15, 0.45]);
  const warmth = useTransform(scrollYProgress, [0.15, 0.6], [0.92, 1]);

  return (
    <motion.div
      style={{ opacity: warmth }}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* traveling warmth */}
      <motion.div
        style={{ y: glowY, opacity: glowOpacity }}
        className="
          absolute -top-40 left-1/2 -translate-x-1/2
          w-[900px] h-[900px] rounded-full
          bg-[radial-gradient(circle,rgba(184,92,51,0.35),transparent_60%)]
          blur-3xl
        "
      />

      {/* drifting clay cloud */}
      <motion.div
        className="
          absolute top-1/3 -left-60
          w-[700px] h-[700px] rounded-full
          bg-[radial-gradient(circle,rgba(220,190,150,0.25),transparent_65%)]
          blur-3xl
        "
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* faint kintsugi sweep */}
      <motion.div
        animate={{ backgroundPosition: ["0% 0%", "200% 200%"] }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        className="
          absolute inset-0 opacity-[0.12]
          bg-[linear-gradient(120deg,transparent,rgba(212,175,120,0.8),transparent)]
          bg-[length:200%_200%]
        "
      />

      {/* paper grain */}
      <div className="absolute inset-0 opacity-[0.04] bg-[url('/noise.png')]" />
    </motion.div>
  );
}
