import ExperienceSection from "./components/ExperienceSection";
import styles from "./Experiences.module.css";

export default function ExperiencesPage() {
  return (
    <main className={styles.wrapper}>
      <div className={styles.hero}>   
      <h1 className={styles.heroTitle}>Choose Your Experience</h1>
        <p className={styles.subheading}>
            From romantic dates to joyful celebrations, we craft experiences as
            unique as the pottery you’ll create.
        </p>
      </div>
      <ExperienceSection
        title="Couple’s Pottery Date"
        tagline="Create together, bond forever"
        description="An intimate pottery session for couples. Shape clay together and take home matching pieces."
        image="/experiences/couple.png"
        duration="2.5 hours"
        people="2 people"
        price="₹3,500"
        includes={[
          "Private studio space",
          "Expert guidance",
          "All materials",
          "2 finished pieces",
        ]}
      />

      <ExperienceSection
        title="Birthday Celebrations"
        tagline="Celebrate with clay & laughter"
        description="A joyful pottery party designed for birthdays—fun, creative, and memorable."
        image="/experiences/birthday.png"
        duration="3 hours"
        people="6–10 people"
        price="₹6,500"
        includes={[
          "Decorated studio",
          "Guided session",
          "Refreshments",
          "Group keepsakes",
        ]}
        reverse
      />

      <ExperienceSection
        title="Farm & Garden Mini Parties"
        tagline="Nature, clay & connection"
        description="Pottery sessions hosted in farm or garden settings for a relaxed, earthy celebration."
        image="/experiences/garden.png"
        duration="3 hours"
        people="8–12 people"
        price="₹8,000"
        includes={[
          "Outdoor setup",
          "Natural clay",
          "Guided activity",
          "Light refreshments",
        ]}
      />

      <ExperienceSection
        title="Studio-Based Experiences"
        tagline="Learn, explore, create"
        description="Structured studio workshops for individuals or small groups to deepen pottery skills."
        image="/experiences/privatestudio.png"
        duration="2 hours"
        people="1–4 people"
        price="₹2,000"
        includes={[
          "Studio access",
          "Skill-based guidance",
          "Materials",
          "Finished piece",
        ]}
        reverse
      />
    </main>
  );
}
