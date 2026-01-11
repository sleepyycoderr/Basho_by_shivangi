// -------vrunda------------------
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // change when deployed
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// -------------------------------

import { Product } from '@/types/product';

export const API_BASE = 'http://127.0.0.1:8000/api';
// lib/api.ts
export const VAPI_BASE = "http://localhost:8000";



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
