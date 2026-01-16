"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

type MusicContextType = {
  isPlaying: boolean;
  playMusic: () => void;
  stopMusic: () => void;
};

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio("/image_aish/audio/bgm.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const playMusic = async () => {
    try {
      await audioRef.current?.play();
      setIsPlaying(true);
    } catch (err) {
      console.warn("Autoplay blocked until user interaction");
    }
  };

  const stopMusic = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  return (
    <MusicContext.Provider value={{ isPlaying, playMusic, stopMusic }}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
  return ctx;
};
