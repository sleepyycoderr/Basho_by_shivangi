"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { useRef } from "react";




/* -----------------------------------------------------
   TYPES
----------------------------------------------------- */

interface GalleryImage {
  id: number;
  src: string; // ⬅ ADD IMAGE PATH HERE LATER
  title: string; // ⬅ ADD IMAGE TITLE LATER
  category:
    | "mugs"
    | "plates"
    | "bowls"
    | "planters";
}

/* -----------------------------------------------------
   FILTER CATEGORIES (UI TABS)
----------------------------------------------------- */

const categories = [
  { value: "all", label: "All" },
  { value: "mugs", label: "Mugs & Drinkware" },
  { value: "plates", label: "Plates & Servingware" },
  { value: "bowls", label: "Bowls & Storage" },
  { value: "planters", label: "Planters & Decor" },
];

/* -----------------------------------------------------
   GALLERY DATA
   👉 ADD / MAP IMAGES TO CATEGORIES HERE
----------------------------------------------------- */

const galleryImages: GalleryImage[] = [
  // 🟤 BOWLS
  { id: 1, src: "/image_aish/gallery/bowls/b1.png", title: "Ceramic Bowl", category: "bowls" },
  { id: 2, src: "/image_aish/gallery/bowls/b2.png", title: "Hand Thrown Bowl", category: "bowls" },
  { id: 3, src: "/image_aish/gallery/bowls/b3.png", title: "Stoneware Bowl", category: "bowls" },
{ id: 21, src: "/image_aish/gallery/bowls/b4.png", title: "Stone Bowl Set", category: "bowls" },


  // ☕ MUGS
  { id: 4, src: "/image_aish/gallery/mugs/m1.png", title: "Clay Mug", category: "mugs" },
  { id: 5, src: "/image_aish/gallery/mugs/m2.png", title: "Glazed Mug", category: "mugs" },
  { id: 6, src: "/image_aish/gallery/mugs/m3.png", title: "Wheel Thrown Mug", category: "mugs" },
  { id: 7, src: "/image_aish/gallery/mugs/m4.png", title: "Rustic Mug", category: "mugs" },
  { id: 8, src: "/image_aish/gallery/mugs/m5.png", title: "Minimal Mug", category: "mugs" },
  { id: 9, src: "/image_aish/gallery/mugs/m6.png", title: "Earth Tone Mug", category: "mugs" },

  // 🍽️ PLATES
  { id: 10, src: "/image_aish/gallery/plates/p1.png", title: "Dinner Plate", category: "plates" },
  { id: 11, src: "/image_aish/gallery/plates/p2.png", title: "Serving Plate", category: "plates" },
  { id: 12, src: "/image_aish/gallery/plates/p3.png", title: "Stone Plate", category: "plates" },
  { id: 13, src: "/image_aish/gallery/plates/p4.png", title: "Handcrafted Plate", category: "plates" },
  { id: 14, src: "/image_aish/gallery/plates/p5.png", title: "Artisan Plate", category: "plates" },

  // 🌿 DECOR / PLANTERS
  { id: 15, src: "/image_aish/gallery/decor/d1.png", title: "Studio Decor", category: "planters" },
  { id: 16, src: "/image_aish/gallery/decor/d2.png", title: "Clay Detail", category: "planters" },
  { id: 17, src: "/image_aish/gallery/decor/d3.png", title: "Textured Pottery", category: "planters" },
  { id: 18, src: "/image_aish/gallery/decor/d4.png", title: "Decor Piece", category: "planters" },
  { id: 19, src: "/image_aish/gallery/decor/d5.png", title: "Artisan Detail", category: "planters" },
  { id: 20, src: "/image_aish/gallery/decor/d6.png", title: "Craft Process", category: "planters" },







];





/* -----------------------------------------------------
   PAGE COMPONENT
----------------------------------------------------- */




function shuffleArray<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}


export default function GalleryPage() {

  const [userPaused, setUserPaused] = useState(false);

const [playingVideo, setPlayingVideo] = useState<"video1" | "video2" | null>(null);

const video1Ref = useRef<HTMLVideoElement | null>(null);
const video2Ref = useRef<HTMLVideoElement | null>(null);

const playVideo = (id: "video1" | "video2") => {
  setUserPaused(false);

  if (id === "video1") {
    video2Ref.current?.pause();
    video1Ref.current?.play();
    setPlayingVideo("video1");
  } else {
    video1Ref.current?.pause();
    video2Ref.current?.play();
    setPlayingVideo("video2");
  }
};





  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] =
    useState<GalleryImage | null>(null);



  const shuffledImages = useMemo(() => {
  return shuffleArray(galleryImages);
}, []);

const filteredImages =
  activeCategory === "all"
    ? shuffledImages
    : galleryImages.filter(
        (img) => img.category === activeCategory
      );



  const currentIndex = selectedImage
    ? filteredImages.findIndex(
        (img) => img.id === selectedImage.id
      )
    : -1;

  const goPrev = () => {
    if (currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1]);
    }
  };

  const goNext = () => {
    if (currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1]);
    }
  };

  return (
    <>
     {/* =====================================================
    SECTION 1 — PAGE HEADER (WITH BACKGROUND IMAGE)
===================================================== */}
<section className="relative h-[40vh] flex items-center justify-center text-center overflow-hidden">

  {/* 🔽 ADD BACKGROUND IMAGE PATH HERE LATER */}
    <img
    src="/image_aish/home/home_pot.jpg"
    alt="Gallery background"
    className="absolute inset-0 w-full h-full object-cover"
  />


  {/* Dark overlay for readability */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#7f8f7a]/70 via-[#7f8f7a]/40 to-black/70" />


  <div className="relative z-10 max-w-3xl px-6">
    <h1 className="font-display text-5xl md:text-6xl text-white mb-4">
      Gallery
    </h1>
    <p className="text-white/80 text-lg">
      A visual journey through our artisanal world
    </p>
  </div>
</section>


      {/* =====================================================
          SECTION 2 — FILTER + GALLERY GRID
      ===================================================== */}
      <section className="section-padding bg-[#F6F3EE] pt-14 px-6 md:px-10 lg:px-16 pb-32 md:pb-40">

        <div className="container-basho">
          {/* FILTER BUTTONS */}
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-6 py-2 rounded-full border transition-all
                  ${
                    activeCategory === cat.value
                      ? "bg-[var(--basho-brown)] text-white border-[var(--basho-brown)]"
                      : "bg-[#F6F3EE] text-[#6B4A2D] border border-[#E2D6C7] hover:bg-[#EFE8DD]"

                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* IMAGE GRID */}
          {/* IMAGE GRID — MASONRY STYLE */}
{/* IMAGE GRID — LOVABLE STYLE GRID */}
<div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[240px] gap-6">


 {filteredImages.map((image, index) => {
  const total = filteredImages.length;
  const isLastFive = index >= total - 5;
  const pos = index - (total - 5);

  return (
    <motion.div
      key={image.id}
      initial={{ opacity: 0.6, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      onClick={() => setSelectedImage(image)}
      className={`relative overflow-hidden rounded-xl cursor-pointer group
        ${
          isLastFive
            ? pos === 0 || pos === 2
              ? "md:col-span-2 md:row-span-2"
              : "md:col-span-1 md:row-span-1"
            : index % 6 === 0
              ? "md:col-span-2 md:row-span-2"
              : "md:col-span-1 md:row-span-1"
        }
      `}
    >
      <img
        src={image.src}
        alt={image.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-4 left-4">
          <p className="text-white text-lg font-display">
            {image.title}
          </p>
          <p className="text-white/70 text-sm capitalize">
            {image.category}
          </p>
        </div>
      </div>
    </motion.div>
  );
})}

</div>

        </div>
      </section>

      {/* =====================================================
          SECTION 3 — BEHIND THE SCENES (VIDEOS)
      ===================================================== */}
      <section className="section-padding bg-[#efe9dd] py-24">

        <div className="container-basho px-6 md:px-12">

          <div className="text-center mb-16">
            <h2 className="font-display text-6xl mb-4 text-[#3f4a44]">
  Behind the Scenes
</h2>

<p className="text-[#6b6b6b] text-lgi">
  Watch the artistry unfold - from raw clay to finished masterpiece
</p>

          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* VIDEO 1 */}
            <motion.div
  initial={{ opacity: 0, x: -25, filter: "blur(6px)" }}
  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
  className="relative aspect-video rounded-xl overflow-hidden"
>
  <video
    ref={video1Ref}
    src="/image_aish/videos/video1.mp4"
    controls
    muted
    playsInline
    className={`w-full h-full object-cover transition-all duration-300
      ${playingVideo !== "video1" ? "blur-sm" : "blur-0"}
    `}
    onPlay={() => {
  if (!userPaused) playVideo("video1");
}}
onClick={() => {
  if (playingVideo === "video1") {
    setUserPaused(true);
    video1Ref.current?.pause();
    setPlayingVideo(null);
  }
}}

  />

  {/* ▶ PLAY OVERLAY (only when NOT playing) */}
  {playingVideo !== "video1" && (
    <div
      onClick={() => playVideo("video1")}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 cursor-pointer"
    >
      <div className="w-14 h-14 rounded-full bg-[#d8c7b5] flex items-center justify-center mb-3">
        <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[14px] border-t-transparent border-b-transparent border-l-[#8b4a1d]" />
      </div>

      <p className="text-white font-display text-lg">
        Wheel Throwing Process
      </p>
    </div>
  )}
</motion.div>





            {/* VIDEO 2 */}
         <motion.div
  initial={{ opacity: 0, x: 25, filter: "blur(6px)" }}
  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
  className="relative aspect-video rounded-xl overflow-hidden"
>
  <video
    ref={video2Ref}
    src="/image_aish/videos/video2.mp4"
    controls
    muted
    playsInline
    className={`w-full h-full object-cover transition-all duration-300
      ${playingVideo !== "video2" ? "blur-sm" : "blur-0"}
    `}
    onPlay={() => {
  if (!userPaused) playVideo("video2");
}}
onClick={() => {
  if (playingVideo === "video2") {
    setUserPaused(true);
    video2Ref.current?.pause();
    setPlayingVideo(null);
  }
}}

  />

  {/* ▶ PLAY OVERLAY (only when NOT playing) */}
  {playingVideo !== "video2" && (
    <div
      onClick={() => playVideo("video2")}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 cursor-pointer"
    >
      <div className="w-14 h-14 rounded-full bg-[#d8c7b5] flex items-center justify-center mb-3">
        <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[14px] border-t-transparent border-b-transparent border-l-[#8b4a1d]" />
      </div>

      <p className="text-white font-display text-lg">
        Glazing & Firing
      </p>
    </div>
  )}
</motion.div>





          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 4 — INSTAGRAM CTA
      ===================================================== */}
      <section className="bg-[#d8cfbf] text-center py-20 pb-14 px-6">
  <h2 className="font-display text-4xl md:text-5xl mb-6 text-[#1f2f2a]">
    Share Your Basho Moments
  </h2>

  <p className="text-[#4a4a4a] text-lg mb-10 whitespace-nowrap">
  Tag us @bashobyyshivangi on Instagram for a chance to be featured in our gallery
</p>


  <a
    href="https://www.instagram.com/bashobyyshivangi/"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block px-10 py-4 rounded-full bg-[var(--basho-terracotta)] text-white font-medium tracking-wide hover:opacity-90 transition"
  >
    Follow on Instagram
  </a>
</section>


      {/* =====================================================
          LIGHTBOX MODAL
      ===================================================== */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X size={28} />
            </button>

            {currentIndex > 0 && (
              <button
                className="absolute left-6 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
              >
                <ChevronLeft size={32} />
              </button>
            )}

            {currentIndex <
              filteredImages.length - 1 && (
              <button
                className="absolute right-6 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
              >
                <ChevronRight size={32} />
              </button>
            )}

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* TODO: ADD FULL IMAGE SRC */}
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="rounded-xl max-h-[80vh]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
