"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // TEMP demo credentials (replace later with backend)
    const correctUsername = "justaishwaryx";
    const correctPassword = "123";

    if (username !== correctUsername || password !== correctPassword) {
      setError("Incorrect credentials!");
      return;
    }

    // success
    setError("");
    window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-center px-6 py-24 bg-[linear-gradient(rgba(255,250,243,0.3),rgba(255,250,243,0.3)),url('/image_aish/home/bg.jpg')] bg-cover bg-center bg-no-repeat backdrop-blur-2xl">

      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-3xl px-10 py-12 shadow-sm border border-[var(--basho-divider)]">

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
            <span className="text-sm text-[#a49a8a]">or</span>
            <div className="flex-1 h-px bg-[var(--basho-divider)]" />
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
        </div>

        {/* Footer */}
        <p className="mt-10 text-sm text-[#c2b29b]">
          Handcrafted with care
        </p>
      </div>
    </div>
  );
}
