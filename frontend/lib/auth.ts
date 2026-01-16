export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export const getUsername = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("username");
};

export const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
};


export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("username");
};

export async function refreshAccessToken() {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) return null;

  const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  localStorage.setItem("accessToken", data.access);
  return data.access;
}

