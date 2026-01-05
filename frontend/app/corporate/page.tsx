"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Gift,
  Users,
  Palette,
  Building2,
  CheckCircle2,
  Send,
} from "lucide-react";

/* ---------- Images ---------- */
import heroPottery from "@/public/Images/products/10.png";
import productVase from "@/public/Images/products/12.png";
import productPlate from "@/public/Images/products/11.png";

/* ---------- Data ---------- */

const services = [
  {
    icon: Gift,
    title: "Corporate Gifting",
    description: "Curated gift sets for clients and employees.",
    features: [
      "Custom packaging",
      "Brand logo integration",
      "Bulk discounts",
      "Personalized notes",
    ],
  },
  {
    icon: Users,
    title: "Team Workshops",
    description: "Creative team-building pottery experiences.",
    features: [
      "On-site or studio sessions",
      "All materials included",
      "Professional guidance",
      "Take home creations",
    ],
  },
  {
    icon: Palette,
    title: "Brand Collaborations",
    description: "Exclusive collections and co-branded merchandise.",
    features: [
      "Custom designs",
      "Limited editions",
      "Event partnerships",
      "Marketing support",
    ],
  },
  {
    icon: Building2,
    title: "Hospitality & Retail",
    description: "Bespoke tableware solutions.",
    features: [
      "Bulk manufacturing",
      "Consistent quality",
      "Custom glazes",
      "Ongoing supply",
    ],
  },
];

const giftingSets = [
  {
    name: "Essential Set",
    description: "2 cups and saucers",
    image: productVase,
    price: "₹2,500 – ₹4,000",
  },
  {
    name: "Premium Collection",
    description: "Dining set for 4",
    image: productPlate,
    price: "₹8,000 – ₹15,000",
  },
  {
    name: "Bespoke Experience",
    description: "Custom + workshop",
    image: heroPottery,
    price: "₹15,000+",
  },
];

const pastClients = [
  "Tata",
  "Infosys",
  "Google",
  "Airbnb",
  "Taj Hotels",
  "WeWork",
  "Zomato",
  "Nykaa",
];

export default function CorporateClient() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    serviceType: "",
    quantity: "",
    budget: "",
    timeline: "",
    message: "",
  });
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/corporate-inquiry/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed");

      alert("Inquiry submitted! We’ll contact you within 24–48 hours.");
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        serviceType: "",
        quantity: "",
        budget: "",
        timeline: "",
        message: "",
      });
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
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
            src={heroPottery}
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
            CORPORATE SERVICES
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-xl mx-auto text-white/80"
          >
            Elevate your brand with artisanal pottery experiences
          </motion.p>
        </div>
      </section>
      {/* Services */}
      <section className="py-24 bg-[hsl(48_44%_96%)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-xl"
        >
          {" "}
          <h2 className="text-3xl text-[var(--basho-teal)] md:text-4xl font-semibold mb-4">
            {" "}
            WHAT WE OFFER{" "}
          </h2>{" "}
          <p className=" text-gray-700 max-w-2xl mx-auto mb-8">
            {" "}
            From bespoke corporate gifts to immersive team experiences, we
            create meaningful connections through craftsmanship{" "}
          </p>{" "}
        </motion.div>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="
                        bg-white/40
                        rounded-xl
                        p-8
                        border border-[var(--basho-brown)]/30
                        transition-all
                        duration-300
                        ease-out
                        hover:-translate-y-2
                        hover:bg-white/90
                        hover:shadow-xl
                        "

             >
              <service.icon
                className="
                    w-8 h-8 mb-4
                    text-[var(--basho-brown)]
                    transition-colors
                    duration-300
                    group-hover:text-[var(--basho-teal)]
                "
                />

             <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-[var(--basho-teal)]">
                {service.title}
                </h3>

              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {service.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Gifting Sets */}
      <section
        className="py-24"
        style={{ backgroundColor: "hsl(34 30% 88% / 0.5)" }}
      >
        {" "}
        <div className="max-w-6xl mx-auto px-6">
          {" "}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            {" "}
            <h2 className="text-3xl text-[var(--basho-teal)] md:text-4xl font-semibold mb-4">
              {" "}
              CURATED GIFT SETS{" "}
            </h2>{" "}
            <p className="text-gray-600 max-w-2xl mx-auto">
              {" "}
              Pre-designed collections that can be customized to match your
              brand{" "}
            </p>{" "}
          </motion.div>{" "}
          <div className="grid md:grid-cols-3 gap-10">
            {" "}
            {giftingSets.map((set, i) => (
              <motion.div
                key={set.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className=" rounded-xl  bg-white overflow-hidden hover:shadow-xl transition "
              >
                {" "}
                <div className="relative h-56 ">
                  {" "}
                  <Image
                    src={set.image}
                    alt={set.name}
                    fill
                    className="object-cover"
                  />{" "}
                </div>{" "}
                <div className="p-6 text-center">
                  {" "}
                  <h3 className="text-xl text-[var(--basho-teal)] font-semibold mb-2">
                    {set.name}
                  </h3>{" "}
                  <p className="text-gray-600 text-sm mb-3">
                    {" "}
                    {set.description}{" "}
                  </p>{" "}
                  <p className="text-[var(--basho-brown)] font-medium">
                    {" "}
                    {set.price}{" "}
                  </p>{" "}
                </div>{" "}
              </motion.div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Past Clients / Trusted By */}
      <section
        className="py-24 overflow-hidden"
        style={{ backgroundColor: "hsl(48 44% 96%)" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl text-[var(--basho-teal)]  md:text-4xl font-semibold mb-4">
              TRUSTED BY
            </h2>
            <p className="text-gray-600">
              We've had the pleasure of working with some amazing brands
            </p>
          </motion.div>

          {/* Slider */}
          <div className="flex items-center gap-6">
            {/* Left Arrow */}
            <button
              aria-label="Scroll left"
              onClick={() =>
                scrollRef.current?.scrollBy({
                  left: -300,
                  behavior: "smooth",
                })
              }
              className="
                    flex-shrink-0
                    w-14 h-14
                    rounded-full
                    bg-[var(--basho-sand)]/50
                    border border-[var(--basho-brown)]/40
                    flex items-center justify-center
                    hover:bg-[var(--basho-sand)]
                    transition
                    "
            >
              <ChevronLeft className="w-7 h-7 text-[var(--basho-brown)]" />
            </button>

            {/* Scroll Container */}
            <div
              ref={scrollRef}
              className="
                    flex gap-6
                    overflow-x-auto
                    scrollbar-hide
                    scroll-smooth
                    py-4
                    flex-1
                    "
            >
              {pastClients.map((client, index) => (
                <motion.div
                  key={client}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                  className="
                    flex-shrink-0
                    px-8 py-3
                    bg-white
                    border border-[var(--basho-brown)]/20
                    rounded-full
                    text-gray-700
                    font-medium
                    tracking-wide
                    shadow-sm
                    hover:bg-[var(--basho-sand)]/30
                    transition
                    "
                >
                  {client}
                </motion.div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              aria-label="Scroll right"
              onClick={() =>
                scrollRef.current?.scrollBy({
                  left: 300,
                  behavior: "smooth",
                })
              }
              className="
                flex-shrink-0
                w-14 h-14
                rounded-full
                bg-[var(--basho-sand)]/50
                border border-[var(--basho-brown)]/40
                flex items-center justify-center
                hover:bg-[var(--basho-sand)]
                transition
                    "
            >
              <ChevronRight className="w-5 h-5 text-[var(--basho-brown)]" />
            </button>

            {/* Fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[hsl(48_44%_96%)] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[hsl(48_44%_96%)] to-transparent" />
          </div>
        </div>
      </section>
      
      {/* Inquiry Form */}
      <section
        className="py-25"
        style={{ backgroundColor: "hsl(34 30% 88% / 0.5)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16">
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl text-[var(--basho-teal)] md:text-4xl font-semibold mb-6">
                Let’s Create Something Together
              </h2>

              <p className="text-gray-700 mb-8">
                Whether you're looking for unique corporate gifts, planning a
                team-building event, or exploring a collaboration, we'd love to
                hear from you.
              </p>

              <div className="space-y-5">
                {[
                  "Response within 24–48 hours",
                  "Free consultation call",
                  "Custom quotation based on requirements",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--basho-clay)]/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-[var(--basho-clay)]" />
                    </div>
                    <span className="text-gray-800">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT FORM */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur rounded-xl p-8 border border-[var(--basho-brown)]/25 shadow-sm"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company & Contact */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 ">
                      Company Name *
                    </label>
                    <input
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full border border-[var(--basho-brown)]/30 p-2 mt-2 rounded bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Contact Person *
                    </label>
                    <input
                      name="contactName"
                      required
                      value={formData.contactName}
                      onChange={handleChange}
                      className="w-full border border-[var(--basho-brown)]/30 p-2 mt-2 rounded bg-white"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-[var(--basho-brown)]/30 p-2 mt-2 rounded bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-[var(--basho-brown)]/30 p-2 mt-2 rounded bg-white"
                    />
                  </div>
                </div>

                {/* Service Type */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Service Type *
                  </label>
                  <select
                    name="serviceType"
                    required
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full border border-[var(--basho-brown)]/30 p-2 mt-2 rounded bg-white"
                  >
                    <option value="">Select a service</option>
                    <option value="Corporate Gifting">Corporate Gifting</option>
                    <option value="Team Workshop">Team Workshop</option>
                    <option value="Brand Collaboration">
                      Brand Collaboration
                    </option>
                    <option value="Hospitality / Retail">
                      Hospitality / Retail
                    </option>
                  </select>
                </div>

                {/* Quantity / Budget / Timeline */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="e.g. 50 sets"
                      className="w-full border border-[var(--basho-brown)]/30 p-2 mt-2 rounded bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full border border-[var(--basho-brown)]/30 p-2 mt-2 rounded bg-white"
                    >
                      <option value="">Select </option>
                      <option value="under-50k">Under ₹50,000</option>
                      <option value="50k-1l">₹50,000 – ₹1,00,000</option>
                      <option value="1l-5l">₹1,00,000 – ₹5,00,000</option>
                      <option value="above-5l">Above ₹5,00,000</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Timeline
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full border border-[var(--basho-brown)]/30 p-2 mt-2 rounded bg-white"
                    >
                      <option value="">Select </option>
                      <option value="urgent">Within 2 weeks</option>
                      <option value="month">1 month</option>
                      <option value="quarter">2–3 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Additional Details
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your requirements, customisation ideas, or deadlines"
                    className="w-full border border-[var(--basho-brown)]/30 p-2 mt-2 rounded bg-white h-25 resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--basho-clay)] text-white py-3 rounded hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT INQUIRY"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
