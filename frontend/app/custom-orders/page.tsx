"use client";

import { useState ,useRef,useEffect } from "react";
import Image from "next/image";
import { Send, ImageIcon } from "lucide-react";
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
    image: "/Images/workshop-pieces/5.png",
  },
  {
    title: "Wedding Favor Cups",
    client: "Private Client",
    desc: "100 personalized tea cups for wedding guests",
    image: "/Images/workshop-pieces/3.png",
  },
  {
    title: "Decorative Vase Collection",
    client: "Interior Designer",
    desc: "Series of 12 unique statement vases",
    image: "/Images/products/28.png",
  },
];

type FormField =
  | "name"
  | "email"
  | "phone"
  | "product_type"
  | "quantity"
  | "dimensions"
  | "preferred_colors"
  | "timeline"
  | "budget_range"
  | "description"
  | "reference_images";

export default function CustomOrdersPage() {
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",

    product_type: "",
    quantity: 1,

    dimensions: "",
    preferred_colors: "",
    timeline: "",
    budget_range: "",

    description: "",
    reference_images: [] as File[],
  });

  const successRef = useRef<HTMLDivElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<null | {
  name: string;
  product_type: string;
  created_at: string;
}>(null);

useEffect(() => {
  if (submittedOrder && successRef.current) {
    successRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}, [submittedOrder]);


  const handleChange = (field: FormField, value: string | number | File[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = new FormData();

    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    form.append("product_type", formData.product_type);
    form.append("quantity", String(formData.quantity));
    form.append("dimensions", formData.dimensions);
    form.append("preferred_colors", formData.preferred_colors);
    form.append("timeline", formData.timeline);
    form.append("budget_range", formData.budget_range);
    form.append("description", formData.description);

    formData.reference_images.forEach((file) => {
      form.append("reference_images", file);
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/custom-orders/`,
      {
        method: "POST",
        body: form,
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error(err);

      const message =
      err.reference_images?.[0] || err.detail || "Submission failed. Please try again.";

      setError(message);
      setIsSubmitting(false);

      // optional smooth scroll to error
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });

return;

    }

    const data = await res.json();

    setSubmittedOrder({
      name: data.name,
      product_type: data.product_type,
      created_at: data.created_at,
    });
    setError(null);


    setFormData({
      name: "",
      email: "",
      phone: "",
      product_type: "",
      quantity: 1,
      dimensions: "",
      preferred_colors: "",
      timeline: "",
      budget_range: "",
      description: "",
      reference_images: [],
    });
    setIsSubmitting(false);
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_FILES = 5;

  const validateFiles = (files: File[]) => {
    const valid: File[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} exceeds 5MB`);
        continue;
      }

      valid.push(file);
    }

    return valid.slice(0, MAX_FILES);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      reference_images: prev.reference_images.filter((_, i) => i !== index),
    }));
  };


  const formatToIST = (utcString: string) => {
  const date = new Date(utcString);

  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "long",
    timeStyle: "short",
  });
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
            src="/Images/workshop-pieces/10.png"
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
      <section
        className="py-24  "
        style={{ backgroundColor: "hsl(48 44% 96%)" }}
      >
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
                  <p className="text-sm text-gray-700">{step.desc}</p>
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
            {submittedOrder ? (
  <div ref={successRef} className="bg-white border border-green-300 rounded-xl p-8 text-center shadow-sm">
    <h3 className="text-2xl font-semibold text-green-700 mb-4">
      🎉 Custom Order Submitted Successfully
    </h3>

     <p className="text-sm text-gray-700 mb-6">
      Thank you for reaching out. Your custom request has been received.
    </p>
  
   <div className="text-left max-w-md mx-auto mb-6">
    <p className="text-gray-700 mb-2">
      <strong>Name:</strong> {submittedOrder.name}
    </p>

    <p className="text-gray-700 mb-2">
      <strong>Product Type:</strong>{" "}
      {submittedOrder.product_type.replace("_", " ")}
    </p>

    <p className="text-gray-700 mb-6">
      <strong>Submitted on:</strong>{" "}
      {formatToIST(submittedOrder.created_at)}
    </p>
    </div>
      {/* EMAIL VERIFICATION NOTICE */}
  <div
  className="border rounded-xl px-5 py-4 mb-6"
  style={{
    backgroundColor: "#faf6f0",   // warm sand
    borderColor: "#B08968",       // muted clay brown
  }}
>
  <p
    className="text-sm font-medium flex items-center justify-center gap-2"
    style={{ color: "#6D4410" }}   // deep Basho brown
  >
     <strong> 📧 Email verification required </strong>{" "}
  </p>

  <p
    className="text-sm mt-2 text-center"
    style={{ color: "#3B2A1A" }}   // dark earthy text
  >
    We’ve sent a verification link to your email address.
    Please confirm it to proceed with your custom order.
  </p>

  <p
    className="text-xs mt-2 text-center"
    style={{ color: "#7A6A58" }}   // muted secondary text
  >
    Didn’t receive it? Please check your spam or promotions folder.
  </p>
</div>


    <button
      onClick={() => {
        setSubmittedOrder(null);
        setError(null);

        setFormData({
          name: "",
          email: "",
          phone: "",
          product_type: "",
          quantity: 1,
          dimensions: "",
          preferred_colors: "",
          timeline: "",
          budget_range: "",
          description: "",
          reference_images: [],
        });
      }}
      className="px-6 py-2 bg-[var(--basho-brown)] text-white rounded"
    >
      Submit Another Order
    </button>
  </div>
) : (
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
                    Product Type *
                  </label>
                  <select
                    value={formData.product_type}
                    required
                    onChange={(e) =>
                      handleChange("product_type", e.target.value)
                    }
                    className="w-full border border-[var(--basho-brown)]/30 px-4 py-2 rounded bg-white"
                  >
                    <option value="">Select----</option>
                    <option value="cups_mugs">Cups & Mugs</option>
                    <option value="bowls">Bowls</option>
                    <option value="plates">Plates</option>
                    <option value="vases">Vases</option>
                    <option value="decorative">Decorative pieces</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[var(--basho-dark)]">
                  Quantity *
                </label>

                <div className="flex items-center w-fit border border-[var(--basho-brown)]/30 rounded bg-white">
                  <input
                    type="number"
                    min={1}
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        quantity: Math.max(1, Number(e.target.value)),
                      }))
                    }
                    className=" px-4 py-2  text-lg text-[var(--basho-brown)] outline-none"
                  />
                </div>
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
                  value={formData.preferred_colors}
                  onChange={(e) =>
                    handleChange("preferred_colors", e.target.value)
                  }
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
                  value={formData.budget_range}
                  onChange={(e) => handleChange("budget_range", e.target.value)}
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
              <div className="flex flex-col gap-2">
                <label className="text-sm text-[var(--basho-dark)]">
                  Reference Images (Optional)
                </label>

                <div
                  className="border-2 border-dashed border-[var(--basho-brown)]/40 rounded-lg p-6 text-center cursor-pointer hover:bg-[var(--basho-brown)]/5 transition bg-white"
                  onClick={() => document.getElementById("fileInput")?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();

                    const droppedFiles = validateFiles(
                      Array.from(e.dataTransfer.files)
                    );

                    setFormData((prev) => ({
                      ...prev,
                      reference_images: [
                        ...prev.reference_images,
                        ...droppedFiles,
                      ].slice(0, MAX_FILES),
                    }));
                  }}
                >
                  {/* Lucide Image Icon */}
                  <ImageIcon className="w-10 h-10 text-[var(--basho-brown)]/70 mx-auto mb-sm" />

                  <p className="text-sm text-gray-500 mb-1">
                    Drag & drop images or click to upload
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG up to 5MB each
                  </p>
                  <input
                    type="file"
                    id="fileInput"
                    multiple
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                      if (!e.target.files) return;

                      const selectedFiles = validateFiles(
                        Array.from(e.target.files)
                      );

                      setFormData((prev) => ({
                        ...prev,
                        reference_images: [
                          ...prev.reference_images,
                          ...selectedFiles,
                        ].slice(0, MAX_FILES),
                      }));
                    }}
                  />
                </div>

                {/* Preview Selected Images */}
                {formData.reference_images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {formData.reference_images.map((file, idx) => (
                      <div
                        key={idx}
                        className="relative w-24 h-24 rounded-lg overflow-hidden border bg-white shadow-sm group"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-100 "
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* ❗ ERROR MESSAGE */}
              {error && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-4 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.name ||
                  !formData.email ||
                  !formData.description
                }
                className="w-full py-3 bg-[var(--basho-brown)] text-white rounded font-semibold hover:opacity-90 flex items-center justify-center"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" /> SUBMIT CUSTOM ORDER
                    REQUEST
                  </>
                )}
              </button>
            </form>)}
          </motion.div>
        </div>
      </section>
    </section>
  );
} 
