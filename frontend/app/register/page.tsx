"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [strengthText, setStrengthText] = useState("");
  const [strengthColor, setStrengthColor] = useState("");

  /* ✅ OTP STATE */
  const [otp, setOtp] = useState("");

  /* ================= EMAIL VALIDATION ================= */
  useEffect(() => {
    if (!email) {
      setEmailError("");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email id");
    } else {
      setEmailError("");
    }
  }, [email]);

  /* ================= PASSWORD STRENGTH ================= */
  const checkStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  useEffect(() => {
    if (!password1) {
      setStrengthText("");
      return;
    }

    const strength = checkStrength(password1);

    if (strength <= 1) {
      setStrengthText("Weak password");
      setStrengthColor("text-red-500");
    } else if (strength === 2) {
      setStrengthText("Moderate password");
      setStrengthColor("text-orange-500");
    } else {
      setStrengthText("Strong password");
      setStrengthColor("text-green-600");
    }
  }, [password1]);

  const passwordsMatch =
    password1 && password2 && password1 === password2;

  const showPasswordRules = password1.length === 0;

  return (
    /* 🔒 FIXED BACKGROUND — NO RESIZE */
    <div className="min-h-screen flex items-center justify-center px-6
      bg-[linear-gradient(rgba(255,250,243,0.3),rgba(255,250,243,0.3)),url('/image_aish/home/home_pot.jpg')]
      bg-cover bg-center bg-no-repeat pb-24 pt-24">

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

          <h1 className="text-3xl font-serif text-[#3a2a1c] mb-2">
            Create Account
          </h1>
          <p className="text-[var(--basho-muted)] mb-10">
            Begin your journey with Basho
          </p>

          {/* Username */}
          <div className="relative mb-5">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2b29b]" />
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-full bg-transparent border border-[var(--basho-divider)]
              text-black placeholder:text-[#c2b29b] focus:outline-none focus:border-[var(--basho-clay)]"
            />
          </div>

          {/* Email */}
          <div className="relative mb-2">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2b29b]" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-full bg-transparent border border-[var(--basho-divider)]
              text-black placeholder:text-[#c2b29b] focus:outline-none focus:border-[var(--basho-clay)]"
            />
          </div>

          {/* Email Error */}
          <div className="h-5 mb-4">
            {emailError && (
              <p className="text-left text-sm text-red-500 pl-2">
                {emailError}
              </p>
            )}
          </div>

          {/* Send Verification */}
          <button
            type="button"
            className="w-full h-12 mb-6 rounded-full flex items-center justify-center gap-2
            border border-[var(--basho-terracotta)]
            text-[var(--basho-terracotta)]
            hover:bg-[var(--basho-terracotta)] hover:text-white
            transition-all duration-300"
          >
            Send Verification Code
          </button>

          {/* ✅ OTP INPUT */}
          <div className="relative mb-6">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2b29b]" />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-full bg-transparent border border-[var(--basho-divider)]
              text-black placeholder:text-[#c2b29b] focus:outline-none focus:border-[var(--basho-clay)]"
            />
          </div>

          {/* Password */}
          <div className="relative mb-2">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2b29b]" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              className="w-full h-12 pl-11 pr-12 rounded-full bg-transparent border border-[var(--basho-divider)]
              text-black placeholder:text-[#c2b29b] focus:outline-none focus:border-[var(--basho-clay)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a49a8a]"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Password Helper / Strength */}
          <div className="h-5 mb-2">
            {showPasswordRules ? (
              <p className="text-xs text-left pl-2 text-[#9a8f7d]">
                Minimum 8 characters, 1 uppercase letter, 1 special character
              </p>
            ) : (
              strengthText && (
                <p className={`text-sm text-left pl-2 ${strengthColor}`}>
                  {strengthText}
                </p>
              )
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative mb-10">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2b29b]" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="w-full h-12 pl-11 pr-12 rounded-full bg-transparent border border-[var(--basho-divider)]
              text-black placeholder:text-[#c2b29b] focus:outline-none focus:border-[var(--basho-clay)]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a49a8a]"
            >
              {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Register Button */}
          <Link href="/">
            <button
              type="button"
              disabled={!passwordsMatch || !!emailError}
              onClick={() =>
                sessionStorage.setItem("accountCreated", "true")
              }
              className={`w-full h-12 rounded-full text-white flex items-center justify-center gap-2 text-lg
              transition-colors
              ${
                passwordsMatch && !emailError
                  ? "bg-[var(--basho-terracotta)] hover:bg-[var(--basho-clay)]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Create Account
              <ArrowRight size={18} />
            </button>
          </Link>

          <p className="mt-10 text-sm text-[#c2b29b]">
            Handcrafted with care
          </p>
        </div>
      </div>
    </div>
  );
}
