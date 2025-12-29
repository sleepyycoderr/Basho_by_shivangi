"use client";

import { useState } from "react";
import Image from "next/image";
import { Send } from "lucide-react";
import {
  MessageSquare,
  Palette,
  Package,
  CheckCircle2,
} from "lucide-react";
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
    image: "/images/workshop-pieces/2.png",
  },
  {
    title: "Decorative Vase Collection",
    client: "Interior Designer",
    desc: "Series of 12 unique statement vases",
    image: "/images/workshop-pieces/3.png",
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
    <section className="text-[var(--basho-dark)]">
      {/* Hero */}
      <div className="relative h-[70vh] w-full">
        <Image
          src="/images/workshop-pieces/10.png" // hero image placeholder
          alt="Custom handmade pottery"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center px-8">
            <h1 className="text-5xl font-bold text-[var(--basho-sand)] mb-4">
              Custom Orders
            </h1>
            <p className="text-[var(--basho-muted)]">
              Crafted slowly, intentionally, and uniquely — just for you.
            </p>
          </div>
        </div>
      </div>

      {/* Process */}
      <section className="py-24 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-[var(--basho-dark)]">
            How It Works
          </h2>
          <p className="text-[var(--basho-teal)] mb-12">
            From concept to creation, we guide you through every step
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--basho-brown)]/10 mx-auto flex items-center justify-center mb-4 relative">
                  <step.icon className="w-7 h-7 text-[var(--basho-brown)]" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--basho-brown)] text-[var(--basho-sand)] font-bold flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-[var(--basho-brown)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* Past Custom Orders */}
<section className="py-24 bg-[var(--basho-muted)]/30">
  <div className="max-w-7xl mx-auto px-8">

    {/* Heading */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl font-bold text-[var(--basho-dark)] mb-4">
        Previous Custom Work
      </h2>
      <p className="text-[var(--basho-brown)] max-w-2xl mx-auto">
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
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <h3 className="text-lg font-semibold text-[var(--basho-dark)] mb-1">
            {order.title}
          </h3>
          <p className="text-[var(--basho-teal)] text-sm mb-1">
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
      <section className="py-24 bg-[var(--background)]">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-[var(--basho-teal)] mb-4 text-center">
            Start Your Custom Order
          </h2>
          <p className="text-[var(--basho-clay)] mb-8 text-center">
            Fill out the form below and we'll get back to you with a proposal.
          </p>

          <form
  onSubmit={handleSubmit}
  className="bg-[var(--basho-divider)] p-8 rounded-lg shadow-lg space-y-6"
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
        className="w-full px-4 py-2 border rounded text-[var(--basho-dark)] bg-[var(--background)]"
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
        className="w-full px-4 py-2 border rounded text-[var(--basho-dark)] bg-[var(--background)]"
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
        className="w-full px-4 py-2 border rounded text-[var(--basho-dark)] bg-[var(--background)]"
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
      className="w-full px-4 py-2 border rounded text-[var(--basho-dark)] bg-[var(--background)]"
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
      className="w-full px-4 py-2 border rounded text-[var(--basho-dark)] bg-[var(--background)]"
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
      className="w-full px-4 py-2 border rounded text-[var(--basho-dark)] bg-[var(--background)]"
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
      className="w-full px-4 py-2 border rounded text-[var(--basho-dark)] bg-[var(--background)]"
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
      className="w-full px-4 py-2 border rounded text-[var(--basho-dark)] bg-[var(--background)]" 
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
      className="w-full px-4 py-2 border rounded text-[var(--basho-dark)] bg-[var(--background)]"
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
      className="w-full px-4 py-2 border rounded text-[var(--basho-dark)] bg-[var(--background)] resize-none"
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
      className="w-full border border-dashed border-[var(--basho-dark)] rounded p-4 cursor-pointer bg-[var(--background)]"
    />
  </div>

  <button
    type="submit"
    disabled={isSubmitting}
    className="w-full py-3 bg-[var(--basho-brown)] text-[var(--basho-sand)] rounded font-semibold hover:opacity-90 flex items-center justify-center"
  >
    {isSubmitting ? "Submitting..." : (
      <>
        <Send className="w-4 h-4 mr-2" /> Submit Request
      </>
    )}
  </button>

    </form>

        </div>
      </section>
    </section>
  );
}
