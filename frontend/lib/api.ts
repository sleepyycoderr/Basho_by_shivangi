import axios from "axios";
import { Product } from "@/types/product";

// 1. Get the Backend URL from Vercel Environment Variables
// If the variable is missing (local dev), fallback to localhost.
// We remove any trailing slash to avoid double slashes like '//api'.
const RAW_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

// 2. Define the API root (This adds the '/api' you asked about)
const API_BASE = `${RAW_BASE_URL}/api`;

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: RAW_BASE_URL, // Points to https://...hf.space
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
export const VAPI_BASE = RAW_BASE_URL;

/* =========================
   WORKSHOPS
========================= */
export async function fetchWorkshopsClient() {
  try {
    // Uses the dynamic API_BASE variable
    const res = await fetch(`${API_BASE}/experiences/workshops/`);
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch {
    return [];
  }
}

/* ✅ TYPE DEFINITION (Cleaned up duplicates) */
export interface WorkshopRegistrationResponse {
  registration_id: number;
  razorpay_order_id: string;
  amount: number;
}

export async function registerWorkshop(payload: {
  name: string;
  email: string;
  phone: string;
  workshop: number;
  slot: number;
  number_of_participants: number;
  special_requests?: string;
}) {
  // ✅ FIXED: Replaced hardcoded URL with dynamic API_BASE
  const res = await fetch(
    `${API_BASE}/experiences/workshops/register/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const text = await res.text();
  console.log("RAW RESPONSE TEXT:", text);

  try {
    const data = JSON.parse(text);
    if (!res.ok) throw data;
    return data;
  } catch (e) {
    throw new Error("Backend did not return JSON");
  }
}

/* =========================
   PRODUCTS
========================= */
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Product not found");
  }

  return res.json();
}

/* =========================
   CUSTOM ORDERS
========================= */
export async function submitCustomOrder(formData: FormData) {
  // ✅ FIXED: Replaced hardcoded URL with dynamic API_BASE
  const res = await fetch(
    `${API_BASE}/products/custom-orders/`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to submit custom order");
  }

  return res.json();
}
