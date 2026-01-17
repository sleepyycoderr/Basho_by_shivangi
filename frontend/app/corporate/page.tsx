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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type InputProps = {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  value: string; // Add this
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Add this
};

type SelectProps = {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  value: string; // Add this
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Add this
};

type TextareaProps = {
  label: string;
  name: string;
  placeholder?: string;
  value: string; // Add this
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // Add this
};

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
const Input = ({ label, name, required = false, type = "text", value, onChange }: InputProps) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      name={name}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full border border-[var(--basho-brown)]/30 p-2 mt-2 rounded bg-white"
    />
  </div>
);

const Select = ({ label, name, options, required = false, value, onChange }: SelectProps) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full border border-[var(--basho-brown)]/30 p-2 mt-2 rounded bg-white"
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

const Textarea = ({ label, name, placeholder, value, onChange }: TextareaProps) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-[var(--basho-brown)]/30 p-2 mt-2 rounded bg-white h-28 resize-none"
    />
  </div>
);




export default function CorporateClient() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submittedInquiry, setSubmittedInquiry] = useState<null | {
  companyName: string;
  serviceType: string;
  email: string;
  createdAt: string;
}>(null);

// ✅ ADD THIS HERE
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    companyWebsite: "",
    contactName: "",
    email: "",
    phone: "",
    serviceType: "",

    /* --- Corporate Gifting --- */
    giftingOccasion: "",
    giftingQuantity: "",
    giftingBudgetPerItem: "",
    deliveryDate: "",
    customization: [] as string[],

    /* --- Workshops --- */
    teamSize: "",
    workshopType: "",
    workshopLocationType: "",
    workshopDate: "",
    durationPreference: "",

    /* --- Brand Collaboration --- */
    brandType: "",
    collaborationIdea: "",
    collaborationTimeline: "",
    collaborationScope: "",

    message: "",
    budget: "",
    timeline: "",
    consent: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleCheckboxArray = (name: string, value: string) => {
    setFormData((prev) => {
      const arr = prev[name as keyof typeof prev] as string[];
      return {
        ...prev,
        [name]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(""); // ✅ clear old errors

    try {
      const res = await fetch(`${API_BASE}/api/corporate/corporate-inquiry/`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed");

      setSubmittedInquiry({
      companyName: formData.companyName,
      serviceType: formData.serviceType,
      email: formData.email,
      createdAt: new Date().toISOString(),
    });

      

      // ✅ SCROLL AFTER SUCCESS
       window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });

    } catch (err) {
       setError("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

 const service = formData.serviceType;
 const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

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

              <h3 className="text-xl text-[var(--basho-teal)] font-semibold mb-2 transition-colors duration-300 group-hover:text-[var(--basho-teal)]">
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
        className="py-24 bg-[#efe9dd]"
         
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
        className="py-25 bg-[#f5efe4] text-gray-800"
         
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
              {submittedInquiry ? (
  /* ✅ SUCCESS CARD */
  <div className="bg-white border border-green-300 rounded-xl p-10 text-center shadow-sm">
    <h3 className="text-2xl font-semibold text-green-700 mb-4">
      🎉 Inquiry Submitted Successfully
    </h3>

    <p className="text-gray-700 mb-2">
      <strong>Company:</strong> {submittedInquiry.companyName}
    </p>

    <p className="text-gray-700 mb-2">
      <strong>Service:</strong> {submittedInquiry.serviceType}
    </p>

    <p className="text-gray-700 mb-6">
      <strong>Submitted on:</strong>{" "}
      {formatDate(submittedInquiry.createdAt)}
    </p>

    <button
      onClick={() => {
        setSubmittedInquiry(null);
        setFormData({
          companyName: "",
          companyWebsite: "",
          contactName: "",
          email: "",
          phone: "",
          serviceType: "",

          giftingOccasion: "",
          giftingQuantity: "",
          giftingBudgetPerItem: "",
          deliveryDate: "",
          customization: [],

          teamSize: "",
          workshopType: "",
          workshopLocationType: "",
          workshopDate: "",
          durationPreference: "",

          brandType: "",
          collaborationIdea: "",
          collaborationTimeline: "",
          collaborationScope: "",

          message: "",
          budget: "",
          timeline: "",
          consent: false,
        });
      }}
      className="px-6 py-3 bg-[var(--basho-brown)] text-white rounded-lg hover:bg-[var(--basho-terracotta)] transition"
    >
      Submit Another Inquiry
    </button>
  </div>
) : (
              <form onSubmit={handleSubmit} className="space-y-6">
  {/* Company Info */}
  <div className="grid md:grid-cols-2 gap-4">
    <Input 
      label="Company Name *" 
      name="companyName" 
      required 
      value={formData.companyName} 
      onChange={handleChange} 
    />
    <Input 
      label="Company Website" 
      name="companyWebsite" 
      value={formData.companyWebsite} 
      onChange={handleChange} 
    />
  </div>

  <div className="grid md:grid-cols-2 gap-4">
    <Input 
      label="Contact Person *" 
      name="contactName" 
      required 
      value={formData.contactName} 
      onChange={handleChange} 
    />
    <Input
      label="Work Email *"
      name="email"
      type="email"
      required
      value={formData.email} 
      onChange={handleChange}
    />
  </div>

  <Input 
    label="Phone Number" 
    name="phone" 
    type="tel" 
    value={formData.phone} 
    onChange={handleChange} 
  />

  {/* Service Type */}
  <Select
    label="Service Type *"
    name="serviceType"
    required
    options={[
      "Corporate Gifting",
      "Team Workshop",
      "Brand Collaboration",
      
    ]}
    value={formData.serviceType}
    onChange={handleChange}
  />

  {/* Corporate Gifting Section */}
  {service === "Corporate Gifting" && (
    <div className="space-y-6 border-t pt-6">
      <h3 className="font-semibold text-lg text-[var(--basho-teal)]">
        Corporate Gifting Details
      </h3>

      <Select
        label="Occasion / Purpose"
        name="giftingOccasion"
        options={["Festival", "Employee appreciation", "Client gifting", "Event / Conference", "Other"]}
        value={formData.giftingOccasion}
        onChange={handleChange}
      />

      <Input 
        label="Estimated Quantity" 
        name="giftingQuantity" 
        value={formData.giftingQuantity} 
        onChange={handleChange} 
      />

      <Input
        label="Preferred Budget Range (per item)"
        name="giftingBudgetPerItem"
        value={formData.giftingBudgetPerItem}
        onChange={handleChange}
      />

      <Input
        label="Required Delivery Date"
        name="deliveryDate"
        type="date"
        value={formData.deliveryDate}
        onChange={handleChange}
      />

      {/* Customization Checkboxes remain the same as they use handleCheckboxArray directly */}
      <div>
        <label className="text-sm font-medium text-gray-700">Customization Needed</label>
        <div className="mt-2 space-y-2">
          {["Logo", "Custom colors", "Packaging", "Personalized note"].map((item) => (
            <label key={item} className="flex gap-2 items-center text-sm">
              <input
                type="checkbox"
                checked={formData.customization.includes(item)}
                onChange={() => handleCheckboxArray("customization", item)}
                className="mt-1 cursor-pointer"
              />
              {item}
            </label>
          ))}
        </div>
      </div>
    </div>
  )}

  {/* Team Workshop Section */}
  {service === "Team Workshop" && (
    <div className="space-y-6 border-t pt-6">
      <h3 className="font-semibold text-lg text-[var(--basho-teal)]">Workshop Details</h3>
      <Input 
        label="Team Size" 
        name="teamSize" 
        value={formData.teamSize} 
        onChange={handleChange} 
      />
      <Select
        label="Workshop Type"
        name="workshopType"
        options={["Pottery basics", "Hand-building", "Custom experience"]}
        value={formData.workshopType}
        onChange={handleChange}
      />
      <Select
        label="Preferred Location"
        name="workshopLocationType"
        options={["Basho Studio", "Client Location", "Off-site venue"]}
        value={formData.workshopLocationType}
        onChange={handleChange}
      />
      <Input 
        label="Preferred Date / Time Range" 
        name="workshopDate" 
        value={formData.workshopDate} 
        onChange={handleChange} 
      />
      <Select
        label="Duration Preference"
        name="durationPreference"
        options={["2 hours", "Half day", "Full day"]}
        value={formData.durationPreference}
        onChange={handleChange}
      />
    </div>
  )}

  {/* Brand Collaboration Section */}
  {service === "Brand Collaboration" && (
    <div className="space-y-6 border-t pt-6">
      <h3 className="font-semibold text-lg text-[var(--basho-teal)]">Collaboration Details</h3>
      <Select
        label="Brand Type"
        name="brandType"
        options={["Lifestyle", "Hospitality", "Fashion", "Interior", "Other"]}
        value={formData.brandType}
        onChange={handleChange}
      />
      <Textarea
        label="Collaboration Idea / Concept"
        name="collaborationIdea"
        value={formData.collaborationIdea}
        onChange={handleChange}
      />
      <Select
        label="Timeline"
        name="collaborationTimeline"
        options={["Immediate", "1–3 months", "3–6 months", "Flexible"]}
        value={formData.collaborationTimeline}
        onChange={handleChange}
      />
      <Select
        label="Expected Scope"
        name="collaborationScope"
        options={["Limited edition products", "Co-branding", "Event collaboration", "Content collaboration"]}
        value={formData.collaborationScope}
        onChange={handleChange}
      />
    </div>
  )}

  {/* Global Budget & Timeline */}
  <div className="grid md:grid-cols-2 gap-4">
    <Select
      label="Budget Range"
      name="budget"
      options={["Under ₹50,000", "₹50,000 – ₹1,00,000", "₹1,00,000 – ₹5,00,000", "Above ₹5,00,000"]}
      value={formData.budget}
      onChange={handleChange}
    />
    <Select
      label="Timeline"
      name="timeline"
      options={["Within 2 weeks", "1 month", "2–3 months", "Flexible"]}
      value={formData.timeline}
      onChange={handleChange}
    />
  </div>

  <Textarea
    label="Additional Details"
    name="message"
    placeholder="Customisation, delivery city, deadlines, expectations..."
    value={formData.message}
    onChange={handleChange}
  />

  {/* Consent */}
  <div className="flex items-start gap-3 text-sm">
    <input
      type="checkbox"
      name="consent"
      checked={formData.consent}
      onChange={handleChange}
      required
      className="mt-1"
    />
    <span>I agree to be contacted regarding this inquiry.</span>
  </div>

{/* ❗ ERROR MESSAGE */}
  {error && (
  <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-4 py-2">
    {error}
  </p>
)}
  {/* Submit Button */}
  <button
    type="submit"
    disabled={isSubmitting}
    className="w-full bg-[var(--basho-clay)] text-white py-3 rounded hover:bg-[var(--basho-terracotta)] transition flex items-center justify-center gap-2"
  >
    <Send className="w-4 h-4" />
    {isSubmitting ? "SUBMITTING..." : "SUBMIT INQUIRY"}
  </button>
</form> )}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}