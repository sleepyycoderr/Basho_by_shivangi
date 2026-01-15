"use client";

import { useEffect, useState } from "react";

export default function AllReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/reviews/", {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load reviews", err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  function renderStars(rating: number) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(
          <span key={i} className="text-[#123d06] text-xl">★</span>
        );
      } else if (rating >= i - 0.5) {
        stars.push(
          <span key={i} className="text-[#123d06]/70 text-xl">★</span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300 text-xl">★</span>
        );
      }
    }
    return stars;
  }

  return (
    <main className="bg-[#faf6ee] min-h-screen py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="tracking-widest text-sm text-[var(--basho-terracotta)] mb-2">
            CUSTOMER STORIES
          </p>
          <h1 className="text-5xl text-[var(--basho-dark)]">
            Voices of Our Community
          </h1>
        </div>

        {/* Content */}
        {loading && (
          <p className="text-center text-gray-500">Loading reviews...</p>
        )}

        {!loading && reviews.length === 0 && (
          <p className="text-center text-gray-500">
            No reviews available.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-12">
          {reviews.map((review, index) => {
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
                className="bg-white/60 rounded-2xl p-8 shadow-sm"
              >
                {/* Header */}
                <div className="flex items-center mb-4">
                  <div
                    className="w-14 h-14 rounded-full
                               bg-[var(--basho-terracotta)]
                               flex items-center justify-center
                               text-white font-bold text-xl"
                  >
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

                {/* Rating */}
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
      </div>
    </main>
  );
}
