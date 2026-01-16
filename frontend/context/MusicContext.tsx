"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

type MusicContextType = {
  isPlaying: boolean;
  volume: number;
  playMusic: () => void;
  stopMusic: () => void;
  setVolume: (v: number) => void;
};

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.4);

  /* ---------- INIT ---------- */
  useEffect(() => {
    audioRef.current = new Audio("/image_aish/audio/bgm.mp3");
    audioRef.current.loop = true;

    const savedVolume = localStorage.getItem("bgm-volume");
    const savedPlaying = localStorage.getItem("bgm-playing");

    const vol = savedVolume ? Number(savedVolume) : 0.4;
    audioRef.current.volume = vol;
    setVolumeState(vol);

    if (savedPlaying === "true" && vol > 0) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  /* ---------- ACTIONS ---------- */
  const playMusic = async () => {
    try {
      await audioRef.current?.play();
      setIsPlaying(true);
      localStorage.setItem("bgm-playing", "true");
    } catch {
      console.warn("Autoplay blocked");
    }
  };

  const stopMusic = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
    localStorage.setItem("bgm-playing", "false");
  };

  const setVolume = (v: number) => {
    const value = Math.max(0, Math.min(1, v));
    setVolumeState(value);
    localStorage.setItem("bgm-volume", String(value));

    if (audioRef.current) {
      audioRef.current.volume = value;
    }

    if (value === 0) {
      stopMusic();
    } else {
      playMusic();
    }
  };

  return (
    <MusicContext.Provider
      value={{ isPlaying, volume, playMusic, stopMusic, setVolume }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
  return ctx;
};
