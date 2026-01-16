"use client";
import { useScroll, useTransform } from "framer-motion";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import KintsugiHero from "@/components/KintsugiHero";
const journey = [
  {
    year: "2018",
    title: "The Beginning",
    description:
      "Shivangi discovers pottery during a trip to Japan, falling in love with the meditative art of shaping clay.",
    icon: "🌱",
  },
  {
    year: "2019",
    title: "Learning the Craft",
    description:
      "Intensive training under master potters in Kyoto and Surat, blending Japanese techniques with Indian sensibilities.",
    icon: "👐",
  },
  {
    year: "2020",
    title: "Basho is Born",
    description:
      "Named after the legendary Japanese poet Matsuo Bashō, the brand launches with a focus on wabi-sabi aesthetics.",
    icon: "🏺",
  },
  {
    year: "2022",
    title: "Studio Opening",
    description:
      "The Basho Studio opens in Surat, offering workshops and a space for creative community building.",
    icon: "🏠",
  },
  {
    year: "2024",
    title: "Growing Community",
    description:
      "Over 500 workshop participants and countless handcrafted pieces finding homes across India.",
    icon: "🤍",
  },
];

const textContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.18 },
  },
};

const textItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function JourneyBackground() {
  const { scrollYProgress } = useScroll();

  const glowY = useTransform(scrollYProgress, [0.1, 0.6], ["0%", "35%"]);
  const cloudY = useTransform(scrollYProgress, [0.1, 0.6], ["0%", "-25%"]);
  const potsY = useTransform(scrollYProgress, [0.1, 0.6], ["0%", "18%"]);
  const glowOpacity = useTransform(scrollYProgress, [0.15, 0.4], [0.25, 0.6]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* warm moving glow */}
      <motion.div
        style={{ y: glowY, opacity: glowOpacity }}
        className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(184,92,51,0.28),transparent_60%)] blur-3xl"
      />

      {/* clay cloud */}
      <motion.div
        style={{ y: cloudY }}
        className="absolute top-1/3 -left-64 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(215,180,130,0.22),transparent_65%)] blur-3xl"
      />

      {/* pottery silhouettes */}
      <motion.div
        style={{ y: potsY }}
        className="absolute bottom-0 right-[-10%] w-[520px] h-[520px] opacity-[0.08] bg-[url('/pots-silhouette.png')] bg-contain bg-no-repeat"
      />

      {/* kintsugi strokes */}
      <motion.div
        animate={{ backgroundPosition: ["0% 0%", "200% 200%"] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(120deg,transparent,rgba(210,150,90,0.8),transparent)] bg-[length:200%_200%]"
      />

      {/* soft paper grain */}
      <div className="absolute inset-0 opacity-[0.035] bg-[url('/noise.png')]" />
    </div>
  );
}
function JourneyAtmosphere() {
  const { scrollYProgress } = useScroll();

  const glowY = useTransform(scrollYProgress, [0.15, 0.6], ["0%", "35%"]);
  const glowOpacity = useTransform(scrollYProgress, [0.15, 0.4], [0.15, 0.45]);
  const warmth = useTransform(scrollYProgress, [0.15, 0.6], [0.92, 1]);

  return (
    <motion.div
      style={{ opacity: warmth }}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {/* traveling warmth */}
      <motion.div
        style={{ y: glowY, opacity: glowOpacity }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full 
        bg-[radial-gradient(circle,rgba(184,92,51,0.35),transparent_60%)] blur-3xl"
      />

      {/* drifting clay cloud */}
      <motion.div
        className="absolute top-1/3 -left-60 w-[700px] h-[700px] rounded-full 
        bg-[radial-gradient(circle,rgba(220,190,150,0.25),transparent_65%)] blur-3xl"
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* faint kintsugi sweep */}
      <motion.div
        animate={{ backgroundPosition: ["0% 0%", "200% 200%"] }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-[0.12]
        bg-[linear-gradient(120deg,transparent,rgba(212,175,120,0.8),transparent)]
        bg-[length:200%_200%]"
      />

      {/* paper grain */}
      <div className="absolute inset-0 opacity-[0.04] bg-[url('/noise.png')]" />
    </motion.div>
  );
}
const SectionSeparator = () => {
  return (
    <div className="relative w-full h-40 overflow-hidden bg-transparent flex items-center justify-center">

      {/* soft mist background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-[120%] h-32 bg-gradient-to-r 
                        from-transparent via-[#c9a26a]/20 to-transparent blur-3xl" />
      </div>

      {/* animated gold crack */}
      <svg
        className="relative z-10 w-[70%] max-w-4xl"
        viewBox="0 0 1000 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M0 60 C 150 20, 300 100, 450 55 C 600 20, 750 90, 1000 60"
          stroke="#c9a26a"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
      </svg>

      {/* floating glow dust */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-2 h-2 rounded-full bg-[#c9a26a]/60 blur-md top-1/2 left-[30%]"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute w-2 h-2 rounded-full bg-[#c9a26a]/50 blur-md top-[45%] left-[65%]"
      />
    </div>
  );
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background Image Motion */}
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/Images/products/17.png"
            alt="Basho pottery studio"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text Content */}
        <div className="relative z-10 text-center px-6 text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            OUR STORY
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-white/80 max-w-xl mx-auto"
          >
            Where Japanese poetry meets Indian earth
          </motion.p>
        </div>
      </section>
    
      <main>
        {/* Our Story / Founder Section */}
        <section
          id="our-story"
          className="w-full bg-[#cbc2b7] py-24"
        >
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT : IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 1.08 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="w-full flex justify-center"
            >
              <div className="relative w-[90%] max-w-md">
                {/* Top brown label tab */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-8 bg-[var(--basho-brown)] z-10" />

                {/* Outer frame */}
                <div className="bg-white p-4 shadow-xl border border-[var(--basho-divider)]">
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <Image
                      src="/image_aish/home/shivaangi_mam.png"
                      alt="Shivangi working on pottery"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT : TEXT */}

            <motion.div
              variants={textContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {/* OUR STORY */}
              <motion.div variants={textItem} className="mb-10">
                <h3 className="font-[var(--font-display)] text-3xl tracking-wide text-[var(--basho-terracotta)] mb-3">
                  MEET THE FOUNDER
                </h3>

                 
              </motion.div>
            
              {/* Heading */}
              <motion.h2
                variants={textItem}
                className="font-[var(--font-display)] text-[38px] leading-[1.25] mb-6 text-black"
              >
                <strong className="font-semibold">Hi, I’m Shivangi — </strong>
                <span className="italic font-normal">
                  the hands <br /> and heart behind Basho.
                </span>
              </motion.h2>

              {/* Paragraphs */}
              <motion.p
                variants={textItem}
                className="text-lg leading-relaxed italic space-y-4 text-black"
              >
                <span className="block">
                  Basho, a Japanese word that means{" "}
                  <span className="font-semibold text-[1.05em]">A Place</span>.
                  But for me, it’s my happy place.
                </span>

                <span className="block">
                  Each piece at Basho is crafted with love and individuality.
                </span>

                <span className="block">
                  Basho was also the name of a legendary Japanese poet known for
                  haiku.
                </span>

                <span className="block">
                  Like poetry, pottery at Basho flows with rhythm and soul.
                </span>

                <span className="block">
                  So come, discover Basho and create your own poetry.
                </span>
              </motion.p>

              <motion.div variants={textItem} className="mt-10 flex">
                <Link
                  href="/studio"
                  className="
                            inline-flex items-center gap-2
                            px-8 py-3
                            rounded-2xl
                            border border-[var(--basho-brown)]
                            text-[var(--basho-brown)]
                            font-medium
                            tracking-wide
                            hover:bg-[var(--basho-brown)]
                            hover:text-white
                            transition-colors
                            "
                >
                  VISIT OUR STUDIO
                  <span className="text-lg">→</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

{/* Journey Timeline */}
<section className="relative pt-36 pb-36 overflow-hidden bg-[#f4eee2]">

  <JourneyAtmosphere />


  <div className="container-basho relative z-10">

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="text-center mb-24"
    >
      <span className="font-display text-[#482910] text-2xl tracking-widest uppercase">
        The Journey
      </span>

      <h2 className="font-display text-[var(--basho-teal)] text-3xl md:text-4xl mt-4">
        FROM INSPIRATION TO CREATION
      </h2>
    </motion.div>

    <div className="relative">

      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--basho-divider)] hidden md:block" />
      <div className="absolute left-6 top-0 bottom-0 w-px bg-[var(--basho-divider)] md:hidden" />

      <div className="space-y-32 relative">
        {journey.map((item, index) => {
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`relative md:flex items-center ${
                isLeft ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div
                className={`w-full md:w-1/2 flex ${
                  isLeft
                    ? "md:justify-end md:pr-16"
                    : "md:justify-start md:pl-16"
                } pl-14 md:pl-0`}
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 120 }}
                  className="journey-card relative bg-white/75 backdrop-blur-xl border border-[var(--basho-divider)] rounded-[28px] px-10 py-9 shadow-[0_25px_60px_rgba(0,0,0,0.08)] max-w-[520px]"
                >
                  <span className="font-display text-2xl text-[var(--basho-brown)]">
                    {item.year}
                  </span>

                  <h3 className="font-display text-xl mt-2 text-[var(--basho-teal)]">
                    {item.title}
                  </h3>

                  <p className="font-serif text-black/80 leading-relaxed mt-3">
                    {item.description}
                  </p>

                  {/* inner glow */}
                  <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_top,rgba(184,92,51,0.12),transparent_60%)]" />
                </motion.div>
              </div>

              <div className="absolute left-6 md:left-1/2 top-14 -translate-x-1/2 z-10">
                <div className="w-4 h-4 rounded-full bg-[var(--basho-brown)] border-4 border-[var(--basho-sand)] shadow-lg" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </div>
</section>



    {/* Artisanship */}
<section className="section-padding bg-[var(--basho-teal)] text-white">
  <div className="max-w-7xl mx-auto p-10">
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

      {/* LEFT : TEXT */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-10"
      >
        <span className="font-display text-sm tracking-widest text-[var(--basho-sand)] uppercase">
          Artisanship & Care
        </span>

        <h2 className="font-display text-3xl md:text-4xl leading-snug">
          Crafted with Intention
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="font-display text-lg text-[var(--basho-sand)] mb-2">
              Materials
            </h3>
            <p className="font-serif text-white/75 leading-relaxed">
              We use locally sourced stoneware clay, fired at high temperatures
              for durability. Our glazes are food-safe, lead-free, and developed
              in-house to achieve nature-inspired tones.
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg text-[var(--basho-sand)] mb-2">
              Process
            </h3>
            <p className="font-serif text-white/75 leading-relaxed">
              Each piece takes 3–4 weeks from clay to completion — wedging,
              throwing, drying, bisque firing, glazing, and final firing. No two
              pieces are identical.
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg text-[var(--basho-sand)] mb-2">
              Care Instructions
            </h3>
            <p className="font-serif text-white/75 leading-relaxed">
              Microwave and dishwasher safe. For longevity, hand washing is
              recommended. Avoid sudden temperature changes and embrace the
              natural patina over time.
            </p>
          </div>
        </div>
      </motion.div>

      {/* RIGHT : IMAGE GRID */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4"
      >
        {[
          "/Images/products/8.png",
          "/Images/products/9.png",
          "/Images/products/30.png",
          "/Images/products/4.png",
        ].map((src, i) => (
          <div
            key={i}
             className="relative aspect-square rounded-2xl overflow-hidden shadow-lg"
          >

            <Image
              src={src}
              alt="Pottery craftsmanship"
              fill
              className="object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  </div>
</section>


        {/* CTA */}
        <section className="section-padding bg-[var(--basho-sand)]/40 flex justify-center">

            <div
            className="
                w-full
                mx-auto
                bg-white/80
                backdrop-blur-sm
                px-10 py-16 md:px-20
                border border-[var(--basho-divider)]
                text-center
                 
            "
            >

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-display text-3xl md:text-4xl text-[var(--basho-teal)] leading-snug">
                EXPERIENCE THE ART OF CLAY
              </h2>
              
                 <p className="font-serif text-muted-foreground text-black leading-relaxed">
                Whether you're looking for a unique piece for your table, a meaningful gift, 
                or wish to try your hand at pottery—we'd love to welcome you.
               
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-5 mt-8">
                <Link
                href="/shop"
                className="
                  inline-flex items-center justify-center
                  px-10 py-4
                  rounded-2xl
                  bg-[var(--basho-clay)]
                  text-white
                  font-medium
                  tracking-wide
                  shadow-md

                  transform
                  transition-all
                  duration-300
                  ease-out

                  hover:-translate-y-1
                  hover:shadow-xl
                  hover:text-white
                  hover:bg-[var(--basho-terracotta)]
                "
              >
  SHOP COLLECTION
</Link>


                <Link
                  href="/workshops"
                  className="
                  inline-flex items-center justify-center
                  px-10 py-4
                  rounded-2xl
                  text-[var(--basho-clay)]
                  bg-white
                  font-medium
                  tracking-wide
                  shadow-md
                  bordrer border-[var(--basho-clay)]

                  transform
                  transition-all
                  duration-300
                  ease-out

                  hover:-translate-y-1
                  hover:shadow-xl
                  hover:text-white
                  hover:bg-[var(--basho-terracotta)]
                "
                >
                  JOIN A WORKSHOP
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
