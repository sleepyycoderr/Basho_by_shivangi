"use client";

import { motion } from "framer-motion";

export default function ClayLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#f2ede6] flex flex-col items-center justify-center overflow-hidden">

      {/* Floating clay dust particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-[#b08c62] rounded-full opacity-50"
          initial={{ x: 0, y: 0, scale: 0.5, opacity: 0 }}
          animate={{
            x: [0, -50 + i * 15, 50 - i * 10, 0],
            y: [0, -80 + i * 10, 80 - i * 5, 0],
            scale: [0.5, 1, 0.7, 0.5],
            opacity: [0, 0.7, 0.3, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Swirling clay-inspired spiral */}
      <motion.div
        className="w-24 h-24 border-4 border-dashed border-[#c9a176] rounded-full"
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      />

      {/* Handcrafted strokes / accents */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-[2px] bg-gradient-to-r from-transparent via-[#7a5a34] to-transparent rounded-full"
          animate={{ rotate: [0, 45, 90, 0], x: [0, 10, -10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 5 + i,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Brand text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="text-center mt-10"
      >
        <h1 className="text-4xl font-light tracking-[0.45em] text-[#2f241c]">
          BASHO
        </h1>
        <p className="mt-2 text-xs tracking-[0.6em] text-[#6f5a42]">
          BY SHIVANGI
        </p>
        <motion.p
          className="mt-3 text-[10px] tracking-[0.45em] text-[#8a745a]"
          animate={{ opacity: [0.4, 1, 0.6, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          FROM CLAY TO SOUL
        </motion.p>
      </motion.div>
    </div>
  );
}
