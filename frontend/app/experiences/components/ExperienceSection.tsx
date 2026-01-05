"use client";

import { useState } from "react";
import styles from "./ExperienceSection.module.css";

const experienceDetails: Record<string, {
  about: string;
  idealFor: string;
  highlights: string[];
  level: string;
  location: string;
}> = {
  "Couple’s Pottery Date": {
    about:
      "A slow, intimate pottery experience designed for couples to create together, laugh together, and take home meaningful handmade pieces.",
    idealFor: "Couples, anniversaries, proposals, quiet celebrations",
    highlights: [
      "Private guided pottery session",
      "Create matching or complementary pieces",
      "Relaxed, romantic studio atmosphere",
    ],
    level: "Beginner-friendly",
    location: "Studio-based",
  },

  "Birthday Celebrations": {
    about:
      "A joyful, hands-on pottery celebration where creativity meets fun. Designed to make birthdays memorable and meaningful.",
    idealFor: "Birthdays for adults, teens & creative groups",
    highlights: [
      "Decorated studio space",
      "Group pottery activities",
      "Celebratory keepsakes",
    ],
    level: "No experience needed",
    location: "Studio-based",
  },

  "Farm & Garden Mini Parties": {
    about:
      "An earthy pottery experience set in nature. Clay, open air, and connection—perfect for relaxed celebrations.",
    idealFor: "Friends, families, small outdoor gatherings",
    highlights: [
      "Nature-inspired pottery session",
      "Outdoor farm or garden setup",
      "Calm, slow-paced creative time",
    ],
    level: "Beginner-friendly",
    location: "Outdoor (Farm/Garden)",
  },

  "Studio-Based Experiences": {
    about:
      "Focused pottery workshops for individuals or small groups looking to explore skills and techniques in depth.",
    idealFor: "Solo creators, learners, small groups",
    highlights: [
      "Skill-based guidance",
      "Hands-on wheel or hand-building",
      "Take-home finished piece",
    ],
    level: "Beginner to intermediate",
    location: "Studio-based",
  },
};

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

      {/* EXPERIENCE DETAILS */}
      <div className={styles.experienceInfo}>
        <h3>{title}</h3>
        <p className={styles.about}>
          {experienceDetails[title].about}
        </p>

        <div className={styles.infoGrid}>
          <div>
            <strong>Ideal For</strong>
            <p>{experienceDetails[title].idealFor}</p>
          </div>

          <div>
            <strong>Level</strong>
            <p>{experienceDetails[title].level}</p>
          </div>

          <div>
            <strong>Location</strong>
            <p>{experienceDetails[title].location}</p>
          </div>
        </div>

        <ul className={styles.highlights}>
          {experienceDetails[title].highlights.map((h, i) => (
            <li key={i}>• {h}</li>
          ))}
        </ul>

        <div className={styles.quickMeta}>
          <span>{duration}</span>
          <span>{people}</span>
          <span className={styles.price}>{price}</span>
        </div>
      </div>

      {/* BOOKING FORM */}
      <form className={styles.form}>
        <h4 className={styles.formTitle}>Book Your Slot</h4>

        <input type="text" placeholder="Full Name" required />
        <input type="tel" placeholder="Phone Number" required />
        <input type="email" placeholder="Email Address" required />
        <input type="date" required />

        <select value={title} disabled>
          <option>{title}</option>
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
