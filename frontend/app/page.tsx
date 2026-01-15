"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import AddReviewModal from "@/components/AddReviewModal";
import ReviewSuccessModal from "@/components/ReviewSuccessModal";


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

  const [showAddReview, setShowAddReview] = useState(false);
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);


  const segment2Ref = useRef<HTMLDivElement>(null);
  const segment3Ref = useRef<HTMLDivElement>(null);

  const [showSuccess, setShowSuccess] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);



useEffect(() => {
  async function fetchReviews() {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/reviews/", {
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

        className="bg-[#FAF8F2] py-24 px-6"

      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <p className="tracking-widest text-sm text-[var(--basho-terracotta)] mb-2">
                HANDCRAFTED COLLECTION
              </p>
              <h2 className="text-4xl text-[var(--basho-dark)]">
                Featured Pieces
              </h2>
            </div>

            {/* TODO: Replace # with collection page link */}
            <a
              href="/shop"
              className="text-[var(--basho-terracotta)] hover:underline"
            >
              View all collection →
            </a>
          </div>

       <div className="grid md:grid-cols-3 gap-8">
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
    <div
      key={index}
      className="bg-white rounded-xl shadow-sm overflow-hidden
                 transition-transform duration-300
                 hover:scale-105 hover:shadow-lg"
    >
      <img
        src={item.img}
        alt={item.name}
        className="h-95 w-full object-cover"
      />

      <div className="p-6">
        <h3 className="text-xl text-[var(--basho-dark)] mb-2">
          {item.name}
        </h3>

        <p className="text-[var(--basho-terracotta)] font-semibold mb-2">
          {item.price}
        </p>
      </div>
    </div>
   
  ))}
</div>



          <div className="mt-16 bg-white/60 border border-[var(--basho-divider)] rounded-xl p-8 text-center text-[var(--basho-dark)]">
            Each piece is unique. Due to the handmade nature of our pottery,
            slight variations in color, shape, and texture are natural and
            intentional—a celebration of wabi-sabi.
          </div>
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
       
          href="#"
          className="px-6 py-3 rounded-md border border-white/40"
        >
          View Schedule
        </a>
      </div>
    </div>

  </div>
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






<section className="bg-[#faf6ee] py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="tracking-widest text-sm text-[var(--basho-terracotta)] mb-2">
            CUSTOMER STORIES
          </p>

          <div className="relative mb-16">
  {/* Centered heading */}
  <h2 className="text-4xl text-[var(--basho-dark)] text-center">
    Voices of Our Community
  </h2>

  {/* Right-aligned Add Review button */}
  {isLoggedIn && (
    <button
      onClick={() => setShowAddReview(true)}
      className="absolute right-0 top-1/2 -translate-y-1/2
                 flex items-center gap-2 text-[var(--basho-terracotta)]
                 hover:underline"
    >
      <span className="text-xl font-bold">+</span>
      Add Review
    </button>
  )}
</div>


<div className="grid md:grid-cols-2 gap-8">

  {loadingReviews && (
    <p className="text-center text-gray-500">Loading reviews...</p>
  )}

  {!loadingReviews && reviews.length === 0 && (
    <p className="md:col-span-2 text-center text-gray-500">
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
    <div
      key={index}
      className="bg-white/50 rounded-xl p-6 text-left shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-[var(--basho-terracotta)]
                        flex items-center justify-center text-white
                        font-bold text-xl">
          {initials}
        </div>

        <div className="ml-4">
          <h3 className="font-semibold text-[var(--basho-dark)]">
            {review.name}
          </h3>
          <p className="text-sm text-[var(--basho-muted)]">
            {review.city}
          </p>
        </div>
      </div>

      {/* ⭐ Rating (HALF STAR SUPPORTED) */}
      <div className="flex mb-3">
        {renderStars(review.rating)}
      </div>

      {/* Message */}
      <p className="text-[var(--basho-teal)] leading-relaxed">
        {review.message}
      </p>
    </div>
  );
})}


          </div>
          {/* ✅ ADD BUTTON RIGHT HERE */}
{reviews.length > 4 && (
  <div className="mt-12 text-center">
    <a
      href="/review"
      className="inline-block px-8 py-3 rounded-full
                 border border-[var(--basho-terracotta)]
                 text-[var(--basho-terracotta)]
                 hover:bg-[var(--basho-terracotta)]
                 hover:text-white
                 transition"
    >
      View all reviews →
    </a>
  </div>
)}
        </div>
      </section>




    </div>
    
     </main>
  );
}