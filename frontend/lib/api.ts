import axios from "axios";
import { Product } from '@/types/product';

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // change when deployed
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
// lib/api.ts
export const VAPI_BASE = "http://localhost:8000";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000/api";

export async function fetchWorkshopsClient() {
  try {
    const res = await fetch(`${API_BASE}/experiences/workshops/`);
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch {
    return [];
  }
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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/experiences/workshops/register/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }}

export async function fetchProducts(): Promise<Product[]> {
 const res = await fetch(`${API_BASE}/products/`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}/`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Product not found');
  }

  return res.json();
}

export async function submitCustomOrder(formData: FormData) {
  const res = await fetch(
    "http://127.0.0.1:8000/api/products/custom-orders/",
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