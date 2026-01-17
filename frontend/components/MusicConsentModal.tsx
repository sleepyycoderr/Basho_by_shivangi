"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useMusic } from "@/context/MusicContext";

export default function MusicConsentModal() {
  const { playMusic } = useMusic();
  const [show, setShow] = useState(false);

  useEffect(() => {
  // ❌ already decided → never show again
  if (sessionStorage.getItem("music-consent")) return;

  const showAfterLoader = () => {
    // ✅ ensure popup shows ONLY ONCE
    if (sessionStorage.getItem("music-popup-shown")) return;

    sessionStorage.setItem("music-popup-shown", "true");
    setShow(true);
  };

  window.addEventListener("loader-finished", showAfterLoader);

  return () => {
    window.removeEventListener("loader-finished", showAfterLoader);
  };
}, []);



  const chooseOn = () => {
    sessionStorage.setItem("music-consent", "on");
    playMusic();
    setShow(false);
  };

  const chooseOff = () => {
    sessionStorage.setItem("music-consent", "off");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-xl p-6 w-[90%] max-w-sm text-center"
          >
            <h2 className="text-xl font-semibold mb-4 text-[#652810]">
              Welcome to Basho 🌿
            </h2>

            <p className="mb-6 text-sm text-gray-600">
              Would you like background music while exploring?
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={chooseOff}
                className="px-4 py-2 border rounded text-[#652810]"
              >
                🔇 Music Off
              </button>

              <button
                onClick={chooseOn}
                className="px-4 py-2 bg-[#652810] text-white rounded"
              >
                🎵 Music On
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
