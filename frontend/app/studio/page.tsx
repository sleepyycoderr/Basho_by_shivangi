"use client";

import styles from "./Studio.module.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { VAPI_BASE } from "@/lib/api";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  badge: string;
}

export default function StudioPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Fetch upcoming events
    //fetch("http://localhost:8000/api/experiences/studio-book/")
    fetch(`${VAPI_BASE}/api/experiences/events/`)
      .then(res => res.json())
      //.then(data => setEvents(data))
      .then(data => {
      // If data has a key "events" -> use it
      if (Array.isArray(data)) {
        setEvents(data);
      } else if (Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        console.error("Unexpected data format", data);
        setEvents([]); // fallback
      }
    })
      .catch(err => console.error(err));
  }, []);

    // 🔒 Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = {
      full_name: (form.elements.namedItem("full_name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      visit_date: (form.elements.namedItem("visit_date") as HTMLInputElement).value,
      time_slot: (form.elements.namedItem("time_slot") as HTMLSelectElement).value,
    };

    try {
      const res = await fetch("${VAPI_BASE}/api/experiences/studio-book/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // setIsOpen(false);
        setIsSuccess(true);
        form.reset(); // ✅ reset the form
        setTimeout(() => setIsSuccess(false), 3000);
        setTimeout(() => {
        setIsSuccess(false); // hide toast after 3s
        setIsOpen(false);    // close modal after toast disappears
        }, 2500);
      } else {
        const errorText = await res.text(); // ✅ get backend error
      console.error("Booking failed:", errorText)
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
   <main className={`${styles.page} ${styles.pageEnter}`}>
{isSuccess && <h1 style={{ color: "red", fontSize: "30px" }}>SUCCESS WORKING</h1>}
     
{/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center text-center overflow-hidden">
        {/* Background Image Motion */}
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/Images/workshop-pieces/18.png"
            alt="Corporate pottery"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text Content */}
        <div className="relative z-10 text-white px-6">
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-5xl font-semibold mb-4"
          >
            OUR STUDIO
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-xl mx-auto text-white/80"
          >
            Where earth meets art — visit our creative sanctuary
          </motion.p>
        </div>
      </section>

      {/* LOCATION */}
      <section className={styles.section}>
        <div className={styles.grid}>

          {/* Map */}
<div className={styles.mapCard}>
  <iframe
    src="https://www.google.com/maps?q=21.1299866,72.7239895&z=17&output=embed"
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    allowFullScreen
  ></iframe>

  {/* Open in Google Maps */}
  <a
    href="https://www.google.com/maps/place/21%C2%B007'48.0%22N+72%C2%B043'26.4%22E"
    target="_blank"
    rel="noopener noreferrer"
    className={styles.openMap}
  >
    Open in Google Maps
  </a>
</div>



          {/* Details */}
          <div className={styles.detailsCard}>
            <h3>Basho Pottery Studio</h3>
            <p>
              Near Dumas Road<br />
              Surat, Gujarat
            </p>

            <div className={styles.hours}>
              <p><strong>Mon–Fri:</strong> 10 AM – 7 PM</p>
              <p><strong>Sat:</strong> 10 AM – 5 PM</p>
              <p><strong>Sun:</strong> By appointment</p>
            </div>

            <button
  className={styles.primaryButton}
  onClick={() => setIsOpen(true)}
>
  Book a Studio Visit
</button>
          </div>
        </div>
      </section>

      {/* STUDIO POLICIES (side scroll like Upcoming Events) */}
      <section className={styles.altSection}>
        <h2 className={styles.sectionTitle}>Studio Policies</h2>

        <div className={styles.horizontalScroll}>
          {[
            ["Food-Safe Materials:", "Handcrafted using stoneware clay and finished with lead-free, food-safe glaze for everyday use."],
            ["Appliance Friendly:", "Oven, microwave, and dishwasher safe—made to fit seamlessly into modern kitchens."],
            ["Care Instructions:", "Dishwasher safe, but gentle handwashing is recommended. Clean lights and artifacts with a damp cloth."],
            ["Handmade & Unique:", "Each piece is lovingly handmade. Natural variations make every product one of a kind."],
          ].map(([title, desc]) => (
            <div key={title} className={styles.card}>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

 {/* UPCOMING EVENTS */}
<section className={styles.section}>
        <h2 className={styles.sectionTitle}>Upcoming Events</h2>
        <div className={styles.horizontalScroll}>
          {events.map(event => (
            <div key={event.id} className={styles.card}>
              <span className={styles.badge}>{event.badge}</span>
              <h3>{event.title}</h3>
              <div className={styles.eventMeta}>
                <div className={styles.metaItem}>📅 {event.date}</div>
                <div className={styles.metaItem}>📍 {event.location}</div>
              </div>
              <p>{event.description}</p>
            </div>
          ))}
        </div>
      </section>


      {/* PAST EXHIBITIONS */}
<section className={styles.altSection}>
  <h2 className={styles.sectionTitle}>Past Exhibitions</h2>

  <div className={styles.gridThree}>
    <div className={styles.exhibitionCard}>
      <img
        src="/Images/products/25.png"
        alt="Wabi-Sabi Exhibition"
      />
      <h3>Wabi-Sabi · Mumbai</h3>
    </div>

    <div className={styles.exhibitionCard}>
      <img
        src="/Images/products/26.png"
        alt="Earth & Fire Exhibition"
      />
      <h3>Earth & Fire · Pune</h3>
    </div>

    <div className={styles.exhibitionCard}>
      <img
        src="/Images/products/27.png"
        alt="Handmade India Exhibition"
      />
      <h3>Handmade India · Delhi</h3>
    </div>
  </div>
</section>
      {/* BOOKING MODAL */}
{isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>✕</button>
            <h3 className={styles.modalTitle}>Book a Studio Visit</h3>
            <form onSubmit={handleBookingSubmit} className={styles.form}>
              <label>
                Your Name
                <input name="full_name" type="text" placeholder="e.g. Lily Sharma" required />
              </label>
              <label>
                Contact Number
                <input name="phone" type="tel" placeholder="We’ll use this to confirm" required />
              </label>
              <label>
                Email
                <input name="email" type="email" placeholder="you@example.com" required/>
              </label>
              <label>
                Visit Date
                <input name="visit_date" type="date" required />
              </label>
              <label>
                Time Slot
                <select name="time_slot" required>
                  <option value="">Select</option>
                  <option>Morning (10–1)</option>
                  <option>Afternoon (1–4)</option>
                  <option>Evening (4–7)</option>
                </select>
              </label>
              <button type="submit" className={styles.primaryButton}>Confirm Booking</button>
            </form>
          </div>
        </div>
      )}


{/* SUCCESS MESSAGE */}
{isSuccess && (
  <div className={styles.successToast}>
    <span>✓</span>
    <p>Your studio visit is booked.<br />We’ll contact you shortly.</p>
  </div>
)}

    </main>
  );
}
