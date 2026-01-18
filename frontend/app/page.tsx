"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import AddReviewModal from "@/components/AddReviewModal";
import ReviewSuccessModal from "@/components/ReviewSuccessModal";
import ClientShell from "@/components/Clientshell";

const philosophy = [
  {
    title: "Wabi-Sabi (侘寂)",
    description:
      "Finding beauty in imperfection. Each piece celebrates the unique marks of the handmaking process.",
    kanji: "侘寂",
  },
  {
    title: "Mono no Aware (物の哀れ)",
    description:
      "Awareness of impermanence. Our pieces are meant to be used, loved, and cherished through time.",
    kanji: "哀",
  },
  {
    title: "Ma (間)",
    description:
      "Negative space. We embrace simplicity, allowing the form and texture to speak for itself.",
    kanji: "間",
  },
  {
    title: "Kanso (簡素)",
    description:
      "Simplicity. Eliminating clutter and the non-essential to reveal natural beauty.",
    kanji: "簡",
  },
];
const theories = [
  {
    title: "Clay Theory",
    description:
      "Clay, as the primary material in pottery, embodies the earth's essence. It teaches us about malleability, transformation through fire, and the beauty of natural variations, aligning with the impermanence celebrated in wabi-sabi.",
    kanji: "粘",
  },
  {
    title: "Craftsman Theory",
    description:
      "The craftsman acts as the bridge between raw material and finished form. Through mindful practice and skilled hands, the potter infuses life into clay, embracing imperfections as integral to the creative journey and personal growth.",
    kanji: "職",
  },
  {
    title: "Kiln Theory",
    description:
      "The kiln represents transformation and surrender. As clay endures intense heat, it emerges stronger, with colors and textures born from the fire's unpredictability, mirroring life's trials and the wabi-sabi acceptance of change.",
    kanji: "窯",
  },
  {
    title: "Glaze Theory",
    description:
      "Glazes veil the clay in subtle hues, allowing imperfections to shine through. They teach us that true beauty lies in the harmonious blend of intention and chance, inspired by Japanese ceramic traditions.",
    kanji: "釉",
  },
];




export default function HomePage() {

  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [showAddReview, setShowAddReview] = useState(false);
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);


  const segment2Ref = useRef<HTMLDivElement>(null);
  const segment3Ref = useRef<HTMLDivElement>(null);

  const [showSuccess, setShowSuccess] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        // ▶ play when visible
        video.play().catch(() => {});
      } else {
        // 🔇 mute + optional pause when user leaves section
        video.muted = true;
        video.pause(); // remove this line if you want silent continue
      }
    },
    { threshold: 0.4 }
  );

  observer.observe(video);

  return () => observer.disconnect();
}, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);



useEffect(() => {
  async function fetchReviews() {
    try {
      const res = await fetch("${VAPI_BASE}/api/reviews/", {
  cache: "no-store",
});

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load reviews", err);
      setReviews([]);
    } finally {
      setLoadingReviews(false); // ✅ THIS WAS MISSING
    }
  }

  fetchReviews();
}, []);



  useEffect(() => {
    const created = sessionStorage.getItem("accountCreated");

    if (created) {
      setShowSuccess(true);
      sessionStorage.removeItem("accountCreated");

      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const scrollToSegment2 = () => {
    segment2Ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSegment3 = () => {
    segment3Ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  function renderStars(rating: number) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      // full star
      stars.push(
        <span key={i} className="text-[#123d06] text-xl">★</span>
      );
    } else if (rating >= i - 0.5) {
      // half star
      stars.push(
        <span key={i} className="text-[#123d06]/70 text-xl">★</span>
      );
    } else {
      // empty star
      stars.push(
        <span key={i} className="text-gray-300 text-xl">★</span>
      );
    }
  }

  return stars;
}


  return (
    <ClientShell> 
    <main>
    
      <div className="w-full overflow-x-hidden">

        {/* ================= SUCCESS POPUP and Review pop up ================= */}
        {showSuccess && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 group">
            <div className="relative px-6 py-3 rounded-full bg-green-600 text-white text-sm font-medium shadow-lg flex items-center gap-3">
              <span>Account Created Successfully!</span>
              <button
                onClick={() => setShowSuccess(false)}
                className="opacity-0 group-hover:opacity-100 transition-opacity
                           absolute right-3 top-1/2 -translate-y-1/2
                           text-white text-sm hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {showAddReview && (
          <AddReviewModal
            onClose={() => setShowAddReview(false)}
            onSuccess={() => setShowReviewSuccess(true)}
          />
        )}

        {showReviewSuccess && (
          <ReviewSuccessModal onClose={() => setShowReviewSuccess(false)} />
        )}
      {/* ================= SEGMENT 1 : HERO ================= */}
      <section
        className="min-h-screen flex items-center justify-center text-center text-white relative"
        style={{
          /* TODO: Add background image path here */
          backgroundImage: "url('/image_aish/home/home_pot.jpg')", 
          backgroundSize: "cover",
          backgroundPosition: "center",
           
        }}
      >
        <div className="bg-black/40 absolute inset-0" />

        <div className="relative z-10 max-w-3xl px-6">
          <p className="tracking-widest text-sm text-[var(--basho-sand)] mb-4">
            HANDCRAFTED IN SURAT, GUJARAT
          </p>

          <h1 className="text-5xl md:text-6xl font-semibold mb-6">
            EMBRACE <br /> IMPERFECTION
          </h1>

          <p className="text-lg text-[var(--basho-muted)] mb-10">
            Japanese-inspired pottery by Shivangi. Each piece celebrates the
            beauty of impermanence through the ancient philosophy of wabi-sabi.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={scrollToSegment2}
              className="px-8 py-3 rounded-md bg-[var(--basho-terracotta)] text-white hover:opacity-90 transition"
            >
              Explore Collection
            </button>

            <button
              onClick={scrollToSegment3}
              className="px-8 py-3 rounded-md border border-[var(--basho-sand)] text-[var(--basho-sand)] hover:bg-white/10 transition"
            >
              Our Philosophy
            </button>
          </div>
        </div>
      </section>

      {/* ================= SEGMENT 2 : FEATURED PIECES ================= */}

<section
  ref={segment2Ref}
  className="relative overflow-hidden py-28 px-4 sm:px-6 bg-[#f7f2ec]"
>
  {/* 🌿 Animated pottery light background */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-[var(--basho-terracotta)]/25 rounded-full blur-[140px]"
  />
  <motion.div
    animate={{ y: [0, -30, 0] }}
    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-[var(--basho-teal)]/20 rounded-full blur-[140px]"
  />
  <motion.div
    animate={{ y: [0, 40, 0] }}
    transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
    className="absolute bottom-0 left-1/3 w-[26rem] h-[26rem] bg-[#d8b48a]/25 rounded-full blur-[140px]"
  />

  <div className="relative max-w-7xl mx-auto">

    {/* 🌾 Header */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16"
    >
      <div>
        <p className="tracking-[0.4em] text-xs text-[var(--basho-terracotta)] mb-3">
          HANDCRAFTED COLLECTION
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[var(--basho-dark)]">
          Featured Pieces
        </h2>
      </div>

      <a
        href="/shop"
        className="text-sm tracking-wide text-[var(--basho-terracotta)]
                   hover:underline self-start sm:self-auto"
      >
        View all collection →
      </a>
    </motion.div>

    {/* 🏺 Product grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
      {[
        {
          img: "/image_aish/home/home_img_1.png",
          name: "Earthglaze Storage Set",
          price: "₹ 2,800",
        },
        {
          img: "/image_aish/home/home_img_2.png",
          name: "Sunfield Hand-Thrown Vase",
          price: "₹ 2,500",
        },
        {
          img: "/image_aish/home/home_img_3.png",
          name: "Blush Heart Serving Bowls",
          price: "₹ 1,000",
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: index * 0.15 }}
          className="group relative bg-white/70 backdrop-blur-xl 
                     border border-[#e4d8c8] rounded-[2rem] 
                     shadow-[0_30px_90px_-40px_rgba(0,0,0,0.35)]
                     hover:shadow-[0_50px_140px_-50px_rgba(0,0,0,0.45)]
                     transition overflow-hidden"
        >
          {/* glow hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--basho-terracotta)]/10 via-transparent to-[var(--basho-teal)]/10 opacity-0 group-hover:opacity-100 transition" />

          {/* image */}
          <div className="overflow-hidden">
            <img
              src={item.img}
              alt={item.name}
              className="h-[22rem] w-full object-cover 
                         group-hover:scale-110 transition duration-700"
            />
          </div>

          {/* content */}
          <div className="relative p-6 sm:p-7 text-center">
            <h3 className="text-lg sm:text-xl font-serif text-[var(--basho-dark)] mb-2">
              {item.name}
            </h3>

            <p className="text-[var(--basho-terracotta)] font-semibold tracking-wide">
              {item.price}
            </p>

            <div className="mt-4 text-xs tracking-[0.35em] text-[var(--basho-muted)]">
              HANDCRAFTED
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* 🌸 Wabi-sabi note */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mt-24 bg-white/70 backdrop-blur-xl border border-[#e4d8c8] 
                 rounded-[2rem] p-10 sm:p-14 text-center 
                 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.3)]"
    >
      <p className="text-[var(--basho-dark)] font-serif text-lg sm:text-xl leading-relaxed">
        Each piece is unique.  
        <span className="block mt-3 text-sm sm:text-base text-[var(--basho-muted)]">
          Due to the handmade nature of our pottery, slight variations in color,
          shape, and texture are natural and intentional — a quiet celebration of
          wabi-sabi.
        </span>
      </p>
    </motion.div>

  </div>
</section>


      {/* ================= SEGMENT 4 : WORKSHOP ================= */}
      <section className="bg-[var(--basho-teal)] py-24 px-6 text-white">
  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">

    {/* Image block — unchanged behavior */}
    <div
      className="h-[420px] rounded-xl bg-center bg-cover"
      style={{ backgroundImage: "url('/image_aish/gallery/decor/d2.png')" }}
    />

    {/* Text block */}
    <div className="flex flex-col justify-between h-[420px]">
      <div>
        <p className="tracking-[0.2em] text-xs mb-4 text-[var(--basho-sand)]">
          LEARN FROM MASTER POTTERS
        </p>

        <h2 className="text-4xl leading-tight mb-6 font-serif">
          Discover the Art of <br />
          <span className="text-[var(--basho-sand)]">
            Handmade Pottery
          </span>
        </h2>

        <p className="text-[var(--basho-muted)]/70 leading-relaxed mb-8 max-w-lg">
          Join our intimate workshops in Surat and learn the meditative art of
          wheel throwing, hand-building, and glazing. From beginners to advanced
          practitioners, find your creative rhythm.
        </p>

        {/* Info boxes */}
        <div className="grid grid-cols-3 gap-4 mb-8">

  {/* 3–4 Hours */}
  <div className="border border-white/20 rounded-lg py-4 text-center">
    <svg
      className="mx-auto mb-2 h-5 w-5 text-[var(--basho-sand)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
    <p className="text-sm">3–4 Hours</p>
  </div>

  {/* Small Groups */}
  <div className="border border-white/20 rounded-lg py-4 text-center">
    <svg
      className="mx-auto mb-2 h-5 w-5 text-[var(--basho-sand)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <circle cx="9" cy="8" r="3" />
      <circle cx="15" cy="8" r="3" />
      <path d="M4 18c0-2.5 3-4 5-4s5 1.5 5 4" />
      <path d="M14 14c2 0 6 1.5 6 4" />
    </svg>
    <p className="text-sm">Small Groups</p>
  </div>

  {/* Weekends */}
  <div className="border border-white/20 rounded-lg py-4 text-center">
    <svg
      className="mx-auto mb-2 h-5 w-5 text-[var(--basho-sand)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
    <p className="text-sm">Weekends</p>
  </div>

</div>



      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <a
          href="/workshops"
          className="px-6 py-3 rounded-md bg-[var(--basho-sand)] text-[var(--basho-dark)] font-medium"
        >
          Book a Workshop
        </a>
{/* TODO: Replace # with collection page link */}
        <a
       
          href="/gallery"
          className="px-6 py-3 rounded-md border border-white/40"
        >
          View Gallery
        </a>
      </div>
    </div>

  </div>
</section>
{/* ================= VIDEO TESTIMONIAL ================= */}
{/* ================= VIDEO TESTIMONIAL ================= */}
<section className="relative overflow-hidden bg-gradient-to-br from-[#f7f3ee] via-[#f1ebe2] to-[#f7f3ee] py-20 lg:py-28 px-6">

  {/* Decorative clay glow circles */}
  <div className="absolute -top-24 -left-24 w-[26rem] h-[26rem] bg-[#c97c5d]/25 rounded-full blur-[110px]" />
  <div className="absolute bottom-0 -right-32 w-[28rem] h-[28rem] bg-[#8c5a3c]/25 rounded-full blur-[120px]" />

  {/* Main container */}
  <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center min-h-[65vh] px-4">

    {/* LEFT: TEXT */}
    <motion.div 
      className="flex-1 relative py-10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      {/* vertical clay line */}
      <div className="absolute -left-6 top-2 h-24 w-[2px] bg-gradient-to-b from-transparent via-[var(--basho-terracotta)] to-transparent" />

      <p className="tracking-[0.35em] text-xs text-[var(--basho-terracotta)] mb-5">
        STUDIO EXPERIENCE
      </p>

      <h2 className="text-4xl md:text-5xl xl:text-6xl text-[var(--basho-dark)] font-serif mb-6 leading-tight">
        Voices from Basho
      </h2>

      <p className="text-[var(--basho-teal)] leading-relaxed mb-10 max-w-xl text-lg xl:text-xl">
        Our visitors describe Basho as more than a pottery studio —  
        it’s a space to slow down, reconnect, and create with intention.
      </p>

      <div className="relative pl-6 border-l border-[var(--basho-terracotta)]">
        <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-[var(--basho-terracotta)] rounded-full" />
        <p className="italic text-[var(--basho-terracotta)] text-lg xl:text-xl leading-relaxed">
          “The experience felt grounding, calm, and deeply personal.”
        </p>
      </div>
    </motion.div>

    {/* RIGHT: VIDEO */}
    <motion.div 
      className="flex-1 w-full aspect-video min-h-[320px] sm:min-h-[400px] lg:min-h-[540px] max-h-[720px] rounded-3xl overflow-hidden bg-black shadow-[0_35px_90px_-20px_rgba(0,0,0,0.45)]"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.15 }}
    >
      {/* glass light overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#c97c5d]/10 via-transparent to-[#8c5a3c]/10 pointer-events-none z-10" />

      <video
        ref={videoRef}
        src="/Videos/basho Pottery Bliss.mp4"
        muted
        controls
        playsInline
        preload="metadata"
        className="w-full h-full object-contain rounded-3xl"
      />
    </motion.div>

  </div>

  {/* bottom clay divider */}
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[180px] h-[2px] bg-[var(--basho-terracotta)] rounded-full opacity-30" />
</section>

    {/* ================= SEGMENT 3 : PHILOSOPHY ================= */}
      <section
        ref={segment3Ref}
        className="bg-[#faf6ee] py-24 px-6"
      >
        <div className="max-w-7xl mx-auto text-center">
          <p className="tracking-widest text-sm text-[var(--basho-terracotta)] mb-4">
            THE ART OF IMPERFECTION
          </p>

          <h2 className="text-5xl text-[var(--basho-dark)] mb-16">
            侘寂 WABI-SABI
          </h2>

          {/* Cards Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
  {philosophy.map((item, index) => (
    <motion.div
      key={item.title}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white/50 border border-[var(--basho-divider)]
                 rounded-2xl p-8 text-center shadow-sm hover:shadow-md
                 transition-shadow"
    >
 {/* Kanji */}
<div className="text-5xl  mb-6 text-[var(--basho-terracotta)]/80">
  {item.kanji}
</div>

{/* Title */}
<h3 className="text-[var(--basho-muted)] font-semibold text-lg mb-3">
  {item.title}
</h3>

{/* Description */}
<p className="text-sm text-[var(--basho-teal)] leading-relaxed">
  {item.description}
</p>

    </motion.div>
  ))}
</div>
<br></br>
<br></br>

          <p className="italic text-[var(--basho-teal)] max-w-3xl mx-auto">
            "In the world of wabi-sabi, crack and erosion are not failures but
            rather the marks of time's passage, the signature of use and love."
          </p>

          <p className="mt-4 text-[var(--basho-terracotta)]">
            — SHIVANGI, FOUNDER
          </p>
        </div>
      </section>

      


      {/* ================= SEGMENT 5 REMOVED (Customer Stories) ================= */}
<section className="bg-gradient-to-b from-[#ede8e2] to-[#f5f1ea] py-24 px-6">
  <div className="max-w-7xl mx-auto">
    {/* Header - Center-aligned with decorative lines */}
    <div className="mb-16 text-center">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="h-px w-16 bg-[var(--basho-terracotta)]"></div>
        <p className="tracking-[0.2em] text-sm text-[var(--basho-terracotta)]">
          THE ESSENCE OF CREATION
        </p>
        <div className="h-px w-16 bg-[var(--basho-terracotta)]"></div>
      </div>
      <h2 className="text-5xl text-[#5d2b14] font-serif">
        THEORIES WE FOLLOW
      </h2>
    </div>

    {/* Cards Grid - Vertical Emphasis */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      {theories.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
          className="group relative bg-white rounded-2xl overflow-hidden
                     shadow-md hover:shadow-xl transition-all duration-300"
        >
          {/* Decorative Top Bar */}
          <div className="h-2 bg-gradient-to-r from-[var(--basho-terracotta)] to-[#5d2b14]"></div>
          
          <div className="p-8">
            {/* Kanji - Watermark Style */}
            <div className="absolute top-8 right-8 text-8xl text-[#5d2b14]/5 
                            font-serif transition-all duration-300
                            group-hover:text-[#5d2b14]/10 group-hover:scale-110">
              {item.kanji}
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Title with Icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--basho-terracotta)]/10 
                                flex items-center justify-center flex-shrink-0">
                  <span className="text-xl text-[var(--basho-terracotta)]">
                    {item.kanji}
                  </span>
                </div>
                <h3 className="text-[#5d2b14] font-semibold text-2xl">
                  {item.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-[var(--basho-teal)] leading-relaxed text-base">
                {item.description}
              </p>
            </div>
          </div>

          {/* Bottom Accent */}
          <div className="h-1 bg-gradient-to-r from-transparent via-[var(--basho-terracotta)]/30 to-transparent"></div>
        </motion.div>
      ))}
    </div>

    {/* Quote Section - Different Style */}
    <div className="relative">
      {/* Decorative Quote Mark */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 
                      text-8xl text-[var(--basho-terracotta)]/10 font-serif">
        "
      </div>
      
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center 
                      border-2 border-[var(--basho-terracotta)]/20 shadow-sm">
        <p className="italic text-[var(--basho-teal)] text-lg max-w-3xl mx-auto mb-4 leading-relaxed">
          "The clay speaks to those who listen, and the craftsman responds with heart and hand."
        </p>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-[var(--basho-terracotta)]"></div>
          <p className="text-[var(--basho-terracotta)] font-semibold tracking-wider">
            SHIVANGI, FOUNDER
          </p>
          <div className="h-px w-8 bg-[var(--basho-terracotta)]"></div>
        </div>
      </div>
    </div>
  </div>
</section>






<section className="bg-gradient-to-b from-[#faf6ee] via-[#fdf8f2] to-[#f7f2ec] py-16 md:py-24 px-4 sm:px-6 lg:px-6">
  <div className="max-w-7xl mx-auto text-center">

    {/* Header */}
    <p className="tracking-widest text-xs sm:text-sm text-[var(--basho-terracotta)] mb-2">
      CUSTOMER STORIES
    </p>

    <div className="relative mb-12 sm:mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl text-[var(--basho-dark)] font-serif leading-tight">
        Voices of Our Community
      </h2>

      {/* Add Review Button */}
      {isLoggedIn && (
        <button
          onClick={() => setShowAddReview(true)}
          className="
            absolute right-0 top-1/2 -translate-y-1/2
            flex items-center gap-2 text-[var(--basho-terracotta)]
            font-semibold hover:underline
            sm:text-base text-sm
            max-sm:static max-sm:mt-6 max-sm:translate-y-0 max-sm:mx-auto
          "
        >
          <span className="text-xl sm:text-2xl font-bold">+</span>
          Add Review
        </button>
      )}
    </div>

    {/* Cards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 sm:gap-8">
      {loadingReviews && (
        <p className="text-center text-gray-500 col-span-full">Loading reviews...</p>
      )}

      {!loadingReviews && reviews.length === 0 && (
        <p className="text-center text-gray-500 col-span-full">
          No reviews yet. Be the first to share your experience.
        </p>
      )}

      {reviews.slice(0, 4).map((review, index) => {
        const initials =
          review.name
            ?.split(" ")
            .map((n: string) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "?";

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="relative bg-white/60 rounded-3xl p-5 sm:p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-500 border-l-4 border-gradient-to-b from-[var(--basho-terracotta)] via-[var(--basho-teal)] to-[var(--basho-terracotta)]"
          >
            {/* Header */}
            <div className="flex items-center mb-3 sm:mb-4 gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--basho-terracotta)] text-white font-bold text-lg sm:text-xl flex items-center justify-center shadow-md">
                {initials}
              </div>
              <div className="text-left">
                <h3 className="text-[var(--basho-dark)] font-semibold text-base sm:text-lg md:text-xl">
                  {review.name}
                </h3>
                <p className="text-[var(--basho-muted)] text-xs sm:text-sm md:text-base">
                  {review.city}
                </p>
              </div>
            </div>

            {/* Star Ratings */}
            <div className="flex mb-3 sm:mb-4">
              {Array.from({ length: 5 }, (_, i) => {
                const filled = review.rating >= i + 1;
                const half = review.rating >= i + 0.5 && review.rating < i + 1;
                return (
                  <span
                    key={i}
                    className={`text-sm sm:text-base md:text-lg transition-colors duration-300 ${
                      filled
                        ? "text-yellow-400"
                        : half
                        ? "text-yellow-300/70"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                );
              })}
            </div>

            {/* Message */}
            <p className="text-[var(--basho-teal)] leading-relaxed text-sm sm:text-base md:text-base">
              {review.message}
            </p>

            {/* Decorative bottom accent */}
            <div className="absolute bottom-0 left-0 w-full h-1 rounded-full bg-gradient-to-r from-[var(--basho-terracotta)] via-[var(--basho-teal)] to-[var(--basho-terracotta)] opacity-40" />
          </motion.div>
        );
      })}
    </div>

    {/* View All Button */}
    {reviews.length > 4 && (
      <div className="mt-8 sm:mt-12 text-center">
        <a
          href="/review"
          className="inline-block px-6 sm:px-8 py-2 sm:py-3 rounded-full border border-[var(--basho-terracotta)] text-[var(--basho-terracotta)] font-semibold hover:bg-[var(--basho-terracotta)] hover:text-white transition-all duration-300 text-sm sm:text-base"
        >
          View all reviews →
        </a>
      </div>
    )}
  </div>
</section>




    </div>
    
     </main>
      </ClientShell>
  );
}