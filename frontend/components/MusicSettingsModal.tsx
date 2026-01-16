"use client";

import { motion, AnimatePresence } from "framer-motion";
import { VolumeX, Volume2 } from "lucide-react";
import { useState } from "react";
import { useMusic } from "@/context/MusicContext";

export default function MusicSettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { volume, setVolume } = useMusic();

  const [tempVolume, setTempVolume] = useState(volume);

  const isMuted = tempVolume === 0;

  const handleDone = () => {
    setVolume(tempVolume);
    onClose();
  };

  const handleCancel = () => {
    setTempVolume(volume); // revert
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
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
            className="bg-white rounded-xl p-6 w-[90%] max-w-sm"
          >
            <h3 className="text-lg font-semibold mb-6 text-[#652810] text-center">
              Background Music Settings
            </h3>

            {/* ICON TOGGLE */}
            <div className="flex justify-center mb-6">
              {isMuted ? (
                <VolumeX
                  size={40}
                  className="cursor-pointer text-gray-500"
                  onClick={() => setTempVolume(0.4)}
                />
              ) : (
                <Volume2
                  size={40}
                  className="cursor-pointer text-[#652810]"
                  onClick={() => setTempVolume(0)}
                />
              )}
            </div>

            {/* SLIDER */}
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={tempVolume}
              onChange={(e) => setTempVolume(Number(e.target.value))}
              className="w-full mb-6"
            />

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border rounded text-[#652810]"
              >
                Cancel
              </button>
              <button
                onClick={handleDone}
                className="px-4 py-2 bg-[#652810] text-white rounded"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
