"use client";

import { useEffect, useState } from "react";
import styles from "./ExperienceSection.module.css";

/* =====================
   TYPES
===================== */
interface Slot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  minParticipants: number;
  maxParticipants: number;
  bookedParticipants: number;
}

interface Props {
  experienceId: number;
  title: string;
  tagline: string;
  description: string;
  image: string;
  duration: string;
  people: string;
  price: string;
  includes: string[];
  reverse?: boolean;
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

  const [step, setStep] = useState<"form" | "confirmed">("form");

  /* =====================
     FETCH SLOTS
  ===================== */
  useEffect(() => {
    if (!open) return;

    fetch(`http://127.0.0.1:8000/api/experiences/${experienceId}/slots/`)
      .then((res) => res.json())
      .then(setSlots)
      .catch(() => setSlots([]));
  }, [open, experienceId]);

  /* =====================
     RAZORPAY
  ===================== */
  const openRazorpay = (data: {
    razorpay_order_id: string;
    amount: number;
  }) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount * 100,
      currency: "INR",
      name: "Basho Studio",
      description: "Experience Booking",
      order_id: data.razorpay_order_id,

      handler: async function (response: any) {
        await fetch(
          "http://127.0.0.1:8000/api/orders/payment/verify/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          }
        );

        setStep("confirmed");
      },

      prefill: {
        name,
        email,
        contact: phone,
      },

      theme: {
        color: "#6B2F14",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  /* =====================
     CREATE BOOKING
  ===================== */
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:8000/api/experiences/book/", {
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

const data = await res.json();
console.log("BOOKING RESPONSE:", data);

if (!res.ok) {
  alert(JSON.stringify(data));
  return;
}


    // 2️⃣ OPEN RAZORPAY (SAME AS WORKSHOP)
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount * 100,
      currency: "INR",
      name: "Basho by Shivangi",
      description: title,
      order_id: data.razorpay_order_id,

      handler: async function (response: any) {
        const verifyRes = await fetch(
          "http://127.0.0.1:8000/api/orders/payment/verify/",
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
          alert("Payment verification failed ❌");
          return;
        }

        setStep("confirmed");
        alert("Payment successful 🎉 Experience booked!");
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
    alert("Something went wrong ❌");
  }
};
 

  return (
    <>
      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

      <section className={`${styles.section} ${reverse ? styles.reverse : ""}`}>
        <div className={styles.imageWrapper}>
          <img src={`http://127.0.0.1:8000${image}`} alt={title} />
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

            {step === "form" && (
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
                    onChange={(e) => setDate(e.target.value)}
                  />

                  <input
                    type="number"
                    min={1}
                    placeholder="Number of Participants"
                    value={participants}
                    onChange={(e) =>
                      setParticipants(Number(e.target.value))
                    }
                  />

                  <select
                    required
                    value={slotId ?? ""}
                    onChange={(e) => setSlotId(Number(e.target.value))}
                  >
                    <option value="">Select Time Slot</option>
                    {slots.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.startTime} – {slot.endTime} (
                        {slot.maxParticipants -
                          slot.bookedParticipants}{" "}
                        spots left)
                      </option>
                    ))}
                  </select>

                  <button type="submit" className={styles.submit}>
                    Proceed to Payment
                  </button>
                </form>
              </>
            )}

            {step === "confirmed" && (
              <>
                <h3>Booking Confirmed 🎉</h3>
                <p>Your experience has been successfully booked.</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
