"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { VAPI_BASE } from "@/lib/api";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddReviewModal({ onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const initials =
    name.trim().length > 0
      ? name
          .trim()
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "?";

  const canSubmit =
    name.trim() && place.trim() && rating >= 0.5 && review.trim();

  // ✅ SINGLE submit function
  async function submitReview() {
    try {
      setLoading(true);

   

const headers: any = {
  "Content-Type": "application/json",
};


const res = await fetch("${VAPI_BASE}/api/reviews/create/", {
  method: "POST",
  cache: "no-store",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name,
    city: place,
    rating,
    message: review,
  }),
});




     if (!res.ok) {
  const text = await res.text();
  console.error("Submit review failed:", res.status, text);
  throw new Error(text);
}



      onClose();
      onSuccess(); // triggers success modal + refresh

    } catch (error) {
      console.error("Failed to submit review");
      alert("Error submitting review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-[#faf6ee] w-[90%] max-w-lg rounded-2xl p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        <h2 className="text-2xl text-center text-[var(--basho-dark)] mb-6">
          Add Your Review
        </h2>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[var(--basho-terracotta)] text-white flex items-center justify-center text-xl font-bold">
            {initials}
          </div>
        </div>

        {/* Name */}
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 px-4 py-2 rounded border text-[#652810]"
        />

        {/* City */}
        <input
          type="text"
          placeholder="Your city"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="w-full mb-3 px-4 py-2 rounded border text-[#652810]"
        />

        {/* Rating */}
        <div className="mb-4">
          <p className="text-sm mb-1 text-[#652810]">Rating</p>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const full = rating >= star;
              const half = rating === star - 0.5;

              return (
                <div key={star} className="relative w-6 h-6 cursor-pointer">
                  {/* Left half */}
                  <button
                    type="button"
                    onClick={() => setRating(star - 0.5)}
                    className="absolute left-0 top-0 w-1/2 h-full z-10"
                  />

                  {/* Right half */}
                  <button
                    type="button"
                    onClick={() => setRating(star)}
                    className="absolute right-0 top-0 w-1/2 h-full z-10"
                  />

                  <span
                    className={`text-2xl ${
                      full
                        ? "text-[#123d06]"
                        : half
                        ? "text-[#123d06]/70"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review */}
        <textarea
          placeholder="Write your experience..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          className="w-full mb-4 px-4 py-2 rounded border text-[#652810]"
        />

        {/* Submit */}
        <button
          disabled={!canSubmit || loading}
          onClick={submitReview}
          className={`w-full py-3 rounded-full text-white ${
            canSubmit
              ? "bg-[var(--basho-terracotta)] hover:bg-[var(--basho-clay)]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {loading ? "Submitting..." : "Add Review"}
        </button>
      </div>
    </div>
  );
}
