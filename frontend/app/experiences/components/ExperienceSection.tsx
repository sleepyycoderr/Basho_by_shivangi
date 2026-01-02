"use client";

import { useState } from "react";
import styles from "./ExperienceSection.module.css";

interface Props {
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

          <div className={styles.includes}>
            <h4>What’s Included:</h4>
            <ul>
              {includes.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <button
            className={styles.button}
            onClick={() => setOpen(true)}
          >
            Book This Experience
          </button>
        </div>
      </section>

      {/* BOOKING MODAL */}
      {open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              className={styles.close}
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

            <h3 className={styles.modalTitle}>Book Your Experience</h3>

            <form className={styles.form}>
              <input type="text" placeholder="Full Name" required />
              <input type="tel" placeholder="Phone Number" required />
              <input type="email" placeholder="Email Address" required />

              <input type="date" required />

              <select defaultValue={title}>
                <option>Couple’s Pottery Date</option>
                <option>Birthday Celebrations</option>
                <option>Farm & Garden Mini Parties</option>
                <option>Studio-Based Experiences</option>
              </select>

              <button type="submit" className={styles.submit}>
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
