"use client";

import { useEffect, useState } from "react";
import styles from "./ExperienceSection.module.css";

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

  // form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotId, setSlotId] = useState<number | null>(null);
  const [participants, setParticipants] = useState(2);

  // OTP flow
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp" | "confirmed">("form");

  /* ---------------- FETCH SLOTS ---------------- */
  useEffect(() => {
    if (!open) return;

    fetch(
      `http://localhost:8000/api/experiences/${experienceId}/slots/`
    )
      .then((res) => res.json())
      .then(setSlots)
      .catch(() => setSlots([]));
  }, [open, experienceId]);

  /* ---------------- CREATE BOOKING ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(
      "http://localhost:8000/api/experiences/book/",
      {
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
      }
    );

    if (!res.ok) {
      alert("Booking failed ❌");
      return;
    }

    const data = await res.json();
    setBookingId(data.booking_id);
    setStep("otp");
  };

  /* ---------------- CONFIRM OTP ---------------- */
const confirmOtp = async () => {
  console.log("BOOKING ID:", bookingId);
  console.log("OTP ENTERED:", otp);

  if (!otp.trim() || !bookingId) {
    alert("Please enter OTP");
    return;
  }

  const res = await fetch(
    "http://localhost:8000/api/experiences/book/confirm/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: bookingId,
        otp: otp.trim(),
      }),
    }
  );

  if (!res.ok) {
    alert("Invalid or expired OTP ❌");
    return;
  }

  setStep("confirmed");
};



  return (
    <>
      <section className={`${styles.section} ${reverse ? styles.reverse : ""}`}>
        <div className={styles.imageWrapper}>
          <img src={image} alt={title} />
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

      {/* ---------------- MODAL ---------------- */}
      {open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.close} onClick={() => setOpen(false)}>
              ✕
            </button>

            {/* STEP 1: FORM */}
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
                    Continue
                  </button>
                </form>
              </>
            )}

            {/* STEP 2: OTP */}
            {step === "otp" && (
              <>
                <h3>Confirm Booking</h3>
                <p>Enter the OTP sent to your email</p>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                />

                <button
                  onClick={confirmOtp}
                  className={styles.submit}
                  disabled={!otp.trim() || !bookingId}
                >
                  Verify OTP
                </button>

              </>
            )}

            {/* STEP 3: CONFIRMED */}
            {step === "confirmed" && (
              <>
                <h3>Booking Confirmed 🎉</h3>
                <p>Your experience has been successfully booked.</p>

                {/* PAYMENT PLACEHOLDER */}
                {/* 
                  PAYMENT INTEGRATION PLACEHOLDER
                  Razorpay / Stripe will be added by payments team
                  booking_id should be passed to gateway
                */}
                <button disabled className={styles.submit}>
                  Proceed to Payment
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
