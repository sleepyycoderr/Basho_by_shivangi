"use client";

import { useState } from "react";
import Image from "next/image";
import { Send } from "lucide-react";
import { MessageSquare, Palette, Package, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const processSteps = [
  {
    icon: MessageSquare,
    title: "Share Your Vision",
    desc: "Tell us about your dream piece. Share references, dimensions, colors, and special requirements.",
  },
  {
    icon: Palette,
    title: "Design & Quote",
    desc: "Our artisans create a design proposal and provide a detailed quote within 3-5 days.",
  },
  {
    icon: Package,
    title: "Crafting",
    desc: "Once approved, we handcraft your piece. Typically 3-6 weeks.",
  },
  {
    icon: CheckCircle2,
    title: "Delivery",
    desc: "Your piece is carefully packaged and delivered to your doorstep.",
  },
];

const pastOrders = [
  {
    title: "Restaurant Dinnerware Set",
    client: "Farm to Table Café",
    desc: "Custom 200-piece dinnerware set with café branding",
    image: "/images/workshop-pieces/5.png",
  },
  {
    title: "Wedding Favor Cups",
    client: "Private Client",
    desc: "100 personalized tea cups for wedding guests",
    image: "/images/workshop-pieces/3.png",
  },
  {
    title: "Decorative Vase Collection",
    client: "Interior Designer",
    desc: "Series of 12 unique statement vases",
    image: "/images/products/28.png",
  },
];

export default function CustomOrdersPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    productType: "",
    quantity: "",
    dimensions: "",
    colors: "",
    timeline: "",
    budget: "",
    description: "",
    files: null as FileList | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string | FileList | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    alert("Custom order request submitted!");
    setFormData({
      name: "",
      email: "",
      phone: "",
      productType: "",
      quantity: "",
      dimensions: "",
      colors: "",
      timeline: "",
      budget: "",
      description: "",
      files: null,
    });
    setIsSubmitting(false);
  };

  return (
    <section
      className="text-[var(--basho-dark)]"
      style={{ backgroundColor: "hsl(48 44% 96%)" }} // Warm Linen
    >
      {/* Hero */}
         <div className="relative h-[60vh] w-full overflow-hidden">

      {/* Background Image with motion */}
      <motion.div
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="/images/workshop-pieces/10.png"
          alt="Custom handmade pottery"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center px-8">

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl font-medium tracking-wide text-white mb-4 font-[var(--font-display)]"
          >
            CUSTOM ORDERS
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-white"
          >
            Crafted slowly, intentionally, and uniquely — just for you.
          </motion.p>

        </div>
      </div>
    </div>

      {/* Process */}
      <section className="py-24  "style={{ backgroundColor: "hsl(48 44% 96%)" }}>
        <div className="max-w-7xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-xl"
          >
            <h2 className="text-3xl font-medium tracking-wide text-[var(--basho-teal)] mb-4 font-[var(--font-display)]">
              HOW IT WORKS
            </h2>
            <p className="text-gray-700 mb-12">
              From concept to creation, we guide you through every step
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--basho-brown)]/10 mx-auto flex items-center justify-center mx-auto mb-3 relative">
                    <step.icon className="w-8 h-8 text-[var(--basho-clay)]" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--basho-clay)] text-[var(--basho-sand)] font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                  </div>
                  <h3 className="text-xl text-[var(--basho-teal)] font-display  mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {step.desc}
                  </p>
                </div>
                {idx < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Custom Orders */}
      <section
        className="py-24"
        style={{ backgroundColor: "hsl(34 30% 88% / 0.2)" }}
      >
        <div className="max-w-7xl mx-auto px-8">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[var(--basho-teal)] mb-4">
              PREVIOUS CUSTOM WORK
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              A glimpse of the bespoke pieces we've created for our clients
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {pastOrders.map((order, index) => (
              <motion.div
                key={order.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4">
                  <Image
                    src={order.image}
                    alt={order.title}
                    width={400}
                    height={300}
                    className=" w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <h3 className="text-lg font-semibold text-[var(--basho-dark)] mb-1">
                  {order.title}
                </h3>
                <p className="text-[var(--basho-teal)] text-sm mb-xs">
                  {order.client}
                </p>
                <p className="text-sm text-[var(--basho-brown)]">
                  {order.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Order Form */}
      <section
        className="py-24 "
        style={{ backgroundColor: "hsl(48 44% 96%)" }}
      >
        <div className="max-w-3xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-xl"
          >
            <h2 className="text-3xl font-bold text-[var(--basho-teal)] mb-4 text-center">
              START YOUR CUSTOM ORDER
            </h2>
            <p className="text-gray-700 mb-8 text-center">
              Fill out the form below and we'll get back to you with a proposal.
            </p>
          </motion.div>
          <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              > 
          <form
            onSubmit={handleSubmit}
            className="bg-white/70 p-8  space-y-6 backdrop-blur rounded-xl  border border-[var(--basho-brown)]/25 shadow-sm"
          >
            <div className="grid md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[var(--basho-dark)]">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                 className="w-full border border-[var(--basho-brown)]/30 px-4 py-2 rounded bg-white"
               
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[var(--basho-dark)]">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full border border-[var(--basho-brown)]/30 px-4 py-2 rounded bg-white"
                  required
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[var(--basho-dark)]">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                   className="w-full border border-[var(--basho-brown)]/30 px-4 py-2 rounded bg-white"
                />
              </div>

              {/* Product Type */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[var(--basho-dark)]">
                  Product Type
                </label>
                <select
                  value={formData.productType}
                  onChange={(e) => handleChange("productType", e.target.value)}
                   className="w-full border border-[var(--basho-brown)]/30 px-4 py-2 rounded bg-white"
                >
                  <option value="">Select----</option>
                  <option value="Cups & Mugs">Cups & Mugs</option>
                  <option value="Bowls">Bowls</option>
                  <option value="Plates">Plates</option>
                  <option value="Vases">Vases</option>
                  <option value="Decorative pieces">Decorative pieces</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[var(--basho-dark)]">
                Quantity
              </label>
              <input
                type="text"
                placeholder="Eg:5 pieces"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
              className="w-full border border-[var(--basho-brown)]/30 px-4 py-2 rounded bg-white"
              />
            </div>

            {/* Dimensions */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[var(--basho-dark)]">
                Dimensions
              </label>
              <input
                type="text"
                placeholder="Dimensions"
                value={formData.dimensions}
                onChange={(e) => handleChange("dimensions", e.target.value)}
                className="w-full border border-[var(--basho-brown)]/30 px-4 py-2 rounded bg-white"
              />
            </div>

            {/* Colors */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[var(--basho-dark)]">
                Preferred Colors/Glazes
              </label>
              <input
                type="text"
                placeholder="Colors / Glazes"
                value={formData.colors}
                onChange={(e) => handleChange("colors", e.target.value)}
                 className="w-full border border-[var(--basho-brown)]/30 px-4 py-2 rounded bg-white"
              />
            </div>

            {/* Timeline */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[var(--basho-dark)]">
                Desired Timeline
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => handleChange("timeline", e.target.value)}
                className="w-full border border-[var(--basho-brown)]/30 px-4 py-2 rounded bg-white"
              >
                <option value="">Select Timeline</option>
                <option value="3-4weeks">3-4 weeks</option>
                <option value="1-2months">1-2 months</option>
                <option value="2-3months">2-3 months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            {/* Budget */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[var(--basho-dark)]">
                Budget Range
              </label>
              <select
                value={formData.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
                className="w-full border border-[var(--basho-brown)]/30 px-4 py-2 rounded bg-white"
              >
                <option value="">Select Budget</option>
                <option value="under-5k">Under ₹5,000</option>
                <option value="5k-15k">₹5,000 - ₹15,000</option>
                <option value="15k-50k">₹15,000 - ₹50,000</option>
                <option value="above-50k">Above ₹50,000</option>
              </select>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[var(--basho-dark)]">
                Describe Your Vision *
              </label>
              <textarea
                placeholder="Tell us about the piece you're envisioning.Include any inspiration,specific details,intended use
      ,or special requirements...."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={5}
                required
                className="w-full border border-[var(--basho-brown)]/30 px-4 py-2 rounded bg-white"
              />
            </div>

            {/* File Upload */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[var(--basho-dark)]">
                Reference Images / Files 
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => handleChange("files", e.target.files)}
                 className="w-full border border-[var(--basho-brown)]/30 px-4 py-2 rounded bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[var(--basho-brown)] text-white rounded font-semibold hover:opacity-90 flex items-center justify-center"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" /> SUBMIT CUSTOM ORDER REQUEST
                </>
              )}
            </button>
          </form>
          </motion.div>
        </div>
      </section>
    </section>
  );
}
