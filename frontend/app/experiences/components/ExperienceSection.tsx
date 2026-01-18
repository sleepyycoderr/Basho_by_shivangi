"use client";

import { useEffect, useState } from "react";
import styles from "./ExperienceSection.module.css";
import { VAPI_BASE } from "@/lib/api";

/* =====================
   TYPES
===================== */
interface Slot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  availableSlots: number;
}

interface ExperienceImage {
  url: string;
  alt?: string;
}


interface Props {
  experienceId: number;
  title: string;
  tagline: string;
  description: string;
  image: ExperienceImage[];
  duration: string;
  people: string;
  price: string;
  includes: string[];
  reverse?: boolean;
  onBookingSuccess: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ExperienceSection({
  experienceId,
  title,
  tagline,
  description,
  image,
  duration,
  people,
  price,
  includes,
  reverse = false,
  onBookingSuccess,
}: Props) {
  const [open, setOpen] = useState(false);

  /* FORM STATE */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotId, setSlotId] = useState<number | null>(null);
  const [participants, setParticipants] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
 
 
  // const [step, setStep] = useState<"form" | "confirmed">("form");

  /* =====================
     FETCH SLOTS
  ===================== */
  useEffect(() => {
  if (!open) return;

  fetch(
    `${VAPI_BASE}/api/experiences/${experienceId}/available-dates/`
  )
    .then((res) => res.json())
    .then(setAvailableDates)
    .catch(() => setAvailableDates([]));
}, [open, experienceId]);

  useEffect(() => {
  if (!date) {
    setSlots([]);
    return;
  }

  fetch(
    `${VAPI_BASE}/api/experiences/${experienceId}/slots-by-date/?date=${date}`
  )
    .then((res) => res.json())
    .then(setSlots)
    .catch(() => setSlots([]));
}, [date, experienceId]);

  /* =====================
     CREATE BOOKING
  ===================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ PREVENT DOUBLE SUBMIT
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("${VAPI_BASE}/api/experiences/book/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience: experienceId,
          slot: slotId,
          full_name: name,
          phone,
          email,
          booking_date: date,
          number_of_people: participants,
        }),
      });

       let data;
        try {
          data = await res.json();
        } catch {
          alert("This slot is fully booked. Please choose another slot.");
          setSubmitting(false);
          return;
        }

      console.log("BOOKING RESPONSE:", data);

      if (!res.ok) {
        alert(data?.slot || "Booking failed. Please try another slot.");
        setSubmitting(false);
        return;
      }


      // 2️⃣ OPEN RAZORPAY
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount * 100,
        currency: "INR",
        name: "Basho by Shivangi",
        description: title,
        order_id: data.razorpay_order_id,

        handler: async function (response: any) {
          const verifyRes = await fetch(
            `${VAPI_BASE}/api/experiences/verify-payment/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );

if (!verifyRes.ok) {
  await fetch("${VAPI_BASE}/api/experiences/release-slot/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      booking_id: data.booking_id,
    }),
  });

  setSubmitting(false);
  alert("Payment failed. Slot released.");
  return;
}


          // ✅ show success globally
          onBookingSuccess();

        // ✅ REFRESH SLOTS AFTER BOOKING
        if (date) {
          fetch(
            `${VAPI_BASE}/api/experiences/${experienceId}/slots-by-date/?date=${date}`
          )
            .then(res => res.json())
            .then(setSlots);
        }

        // ✅ 2. CLOSE MODAL IMMEDIATELY
         setOpen(false);

          // ✅ 3. RESET FORM (background)
          setSubmitting(false);
          setName("");
          setPhone("");
          setEmail("");
          setDate("");
          setSlotId(null);
          setParticipants(2);
        },

        // 👇 USER CLOSES RAZORPAY WITHOUT PAYING
      modal: {
        ondismiss: async () => {
          await fetch("${VAPI_BASE}/api/experiences/release-slot/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              booking_id: data.booking_id,
            }),
          });

      if (date) {
        fetch(
          `${VAPI_BASE}/api/experiences/${experienceId}/slots-by-date/?date=${date}`
        )
          .then(res => res.json())
          .then(setSlots);
      }
      setSubmitting(false);
    },
  },


        prefill: {
          name,
          email,
          contact: phone,
        },

        theme: {
          color: "#8B6F47",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      setSubmitting(false); // ❌ unexpected error
      alert("Something went wrong ❌");
    }
  };

  return (
    <>
      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

      <section className={`${styles.section} ${reverse ? styles.reverse : ""}`}>
        <div className={styles.imageWrapper}>
  {image && image.length > 0 ? (
    <img
      src={image[0].url}// first image
      alt={image[0].alt || title}
    />
  ) : (
    <img
      src="/images/default.png"
      alt={title}
    />
  )}
</div>

        <div className={styles.content}>
          <span className={styles.tagline}>♡ {tagline}</span>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>

          <div className={styles.meta}>
            <span>{duration}</span>
            <span>{people}</span>
            <span className={styles.price}>{price}</span>
          </div>

          <button className={styles.button} onClick={() => setOpen(true)}>
            Book This Experience
          </button>
        </div>
      </section>

      {/* =====================
          MODAL
      ===================== */}
      {open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.close} onClick={() => setOpen(false)}>
              ✕
            </button>

            <>
              <h3 className={styles.modalTitle}>Book Your Experience</h3>

              <form className={styles.form} onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSlotId(null);
                  }}
                  min={availableDates[0]}
                  className={styles.input}
                />


                <input
                  type="number"
                  min={1}
                  placeholder="Number of Participants"
                  value={participants}
                  onChange={(e) => setParticipants(Number(e.target.value))}
                />

                <select
                  required
                  value={slotId ?? ""}
                  onChange={(e) => setSlotId(Number(e.target.value))}
                >
                  <option value="">Select Time Slot</option>

                  {slots.map((slot) => (
                    <option
                      key={slot.id}
                      value={slot.id}
                      disabled={slot.availableSlots <= 0}
                    >
                      {slot.startTime} – {slot.endTime} (
                      {slot.availableSlots > 0
                        ? `${slot.availableSlots} slots left`
                        : "Fully Booked"}
                      )
                    </option>
                  ))}
                </select>

                  {slots.length > 0 &&
                    slots.every((slot) => slot.availableSlots <= 0) && (
                      <p className={styles.fullNotice}>
                        All slots are fully booked for this date.
                      </p>
                  )}

                <button
                  type="submit"
                  className={styles.submit}
                  disabled={submitting}
                >
                  {submitting ? "Processing..." : "Proceed to Payment"}
                </button>
              </form>
            </>
          </div>
        </div>
      )}
    </>
  );
}