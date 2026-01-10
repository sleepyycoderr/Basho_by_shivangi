"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";





export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
 
 console.log("CLIENT ID >>>", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
   

const handleLogin = async () => {
  setError("");

  if (!username || !password) {
    setError("Username and password are required");
    return;
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/accounts/login/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // backend error (400)
      setError(data.error || "Login failed");
      return;
    }

    // ✅ SUCCESS
     localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("username", data.username);

      // ✅ REDIRECT AFTER SAVING
      router.replace("/");
    } catch {
      setError("Server error. Please try again later.");
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
  try {
    const decoded: any = jwtDecode(credentialResponse.credential);
    const email = decoded.email;

    const res = await fetch(
      "http://127.0.0.1:8000/api/accounts/google-login/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Google login failed");
      return;
    }

    // ✅ Save auth (THIS IS CRITICAL)
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    localStorage.setItem("username", data.username);

    router.replace("/"); // ✅ auto login
  } catch (err) {
    setError("Google login failed");
  }
};


  return (
    <div className="flex items-center justify-center px-6 py-24 bg-[linear-gradient(rgba(255,250,243,0.3),rgba(255,250,243,0.3)),url('/image_aish/home/bg.jpg')] bg-cover bg-center bg-no-repeat backdrop-blur-2xl">

      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-3xl px-10 py-12 shadow-sm border border-[var(--basho-divider)] h-225">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/image_aish/basho_logo.jpg"
              alt="Basho by Shivangi"
              width={180}
              height={60}
              priority
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-serif text-[#3a2a1c] mb-2">
            Welcome Back
          </h1>
          <p className="text-[var(--basho-muted)] mb-10">
            Embrace your journey
          </p>

          {/* Username */}
          <div className="relative mb-5">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2b29b]"
            />
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              className="w-full h-12 pl-11 pr-4 rounded-full bg-transparent border border-[var(--basho-divider)]
                         text-black placeholder:text-[#c2b29b] focus:outline-none focus:border-[var(--basho-clay)]"
            />
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2b29b]"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full h-12 pl-11 pr-10 rounded-full bg-transparent border border-[var(--basho-divider)]
                         text-black placeholder:text-[#c2b29b] focus:outline-none focus:border-[var(--basho-clay)]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a49a8a]
                         hover:text-[var(--basho-brown)] transition-colors"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="mb-4 text-sm text-left text-red-600 font-medium">
              {error}
            </p>
          )}

          {/* Sign In Button */}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full h-12 rounded-full bg-[var(--basho-terracotta)] text-white
                       flex items-center justify-center gap-2 text-lg
                       hover:bg-[var(--basho-clay)] transition-colors"
          >
            Sign In
            <ArrowRight size={18} />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-10">
            <div className="flex-1 h-px bg-[var(--basho-divider)]" />
            <span className="text-sm text-[#a49a8a]">Or login with</span>
            <div className="flex-1 h-px bg-[var(--basho-divider)]" />
          </div>

        {/* Sign in with Google */}
<div className="flex justify-center mb-6">
  <GoogleLogin
    onSuccess={handleGoogleLogin}
    onError={() => setError("Google login failed")}
  />
</div>


{/* Create Account */}
<p className="text-[#7c7468] mb-4">Don't have an account?</p>

<a
  href="/register"
  className="inline-flex items-center justify-center gap-2 px-10 py-3 rounded-full
             border border-[var(--basho-terracotta)] text-[var(--basho-terracotta)]
             hover:bg-[var(--basho-terracotta)] hover:text-white
             transition-all duration-300 text-lg"
>
  Create Account
  <ArrowRight size={18} />
</a>
  




        
        {/* Footer */}
        <p className="mt-10 text-sm text-[#c2b29b]">
          Handcrafted with care
        </p>
      </div>
      </div>
      </div>
   
  );
}
