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
  }

  return res.json();
}
