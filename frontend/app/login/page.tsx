"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

export default function LoginPage() {

// for forget password
  const [showForgot, setShowForgot] = useState(false);
const [fpEmail, setFpEmail] = useState("");
const [fpOtp, setFpOtp] = useState("");
const [fpStep, setFpStep] = useState<"email" | "otp" | "reset">("email");
const [fpError, setFpError] = useState("");

const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// ⏱ OTP timers
const [resendTimer, setResendTimer] = useState(30);
const [canResend, setCanResend] = useState(false);
const [otpExpiry, setOtpExpiry] = useState(300); // 5 minutes

// 🔐 Password strength
const [passwordStrength, setPasswordStrength] = useState<
  "weak" | "moderate" | "strong" | ""
>("");




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
    localStorage.setItem("email", data.email);
    localStorage.setItem("username", data.username);
    window.dispatchEvent(new Event("auth-changed"));

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
    localStorage.setItem("email" , data.email);
    localStorage.setItem("username", data.username);
    window.dispatchEvent(new Event("auth-changed"));

    router.replace("/"); // ✅ auto login
  } catch (err) {
    setError("Google login failed");
  }
};


//effects 
// ⏱ Resend OTP timer (30s)
useEffect(() => {
  if (fpStep !== "otp") return;

  if (resendTimer > 0) {
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(timer);
  } else {
    setCanResend(true);
  }
}, [resendTimer, fpStep]);

// ⏱ OTP expiry timer (5 minutes)
useEffect(() => {
  if (fpStep !== "otp") return;

  if (otpExpiry > 0) {
    const timer = setTimeout(() => setOtpExpiry(otpExpiry - 1), 1000);
    return () => clearTimeout(timer);
  } else {
    setFpError("OTP expired. Please resend OTP.");
    setCanResend(true);
  }
}, [otpExpiry, fpStep]);

const checkPasswordStrength = (password: string) => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score === 1) setPasswordStrength("weak");
  else if (score === 2) setPasswordStrength("moderate");
  else if (score === 3) setPasswordStrength("strong");
  else setPasswordStrength("");
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

<button
  className="text-sm text-right text-[#a06b4e] hover:underline w-full mb-4"
  onClick={() => {
  setShowForgot(true);
  setFpStep("email");
  setFpError("");
  setFpEmail("");
  setFpOtp("");
  setNewPassword("");
  setConfirmPassword("");
  setPasswordStrength("");
  setResendTimer(30);
  setOtpExpiry(300);
  setCanResend(false);
}}

>
  Forgot password?
</button>




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

{/* FORGOT PASSWORD  */}
{showForgot && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm">

      <h3 className="text-lg text-[#442D1C] font-semibold mb-4">Reset Password</h3>

      {fpError && (
        <p className="text-red-600 text-sm mb-2">{fpError}</p>
      )}

      {fpStep === "email" && (
        
        <>

          <input
            type="email"
            placeholder="Enter your email"
            value={fpEmail}
            onChange={(e) => setFpEmail(e.target.value)}
            className="w-full border rounded px-4 py-2 mb-3 text-[#442D1C] placeholder:text-[#442D1C]/60"
          />

          <button
            className="w-full bg-[#652810] text-white py-2 rounded
             hover:bg-[#C85428] transition-colors duration-200"
            onClick={async () => {
              setFpError("");

              const res = await fetch(
                "http://127.0.0.1:8000/api/accounts/forgot-password/send-otp/",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: fpEmail }),
                }
              );

              const data = await res.json();

              if (!res.ok) {
                setFpError(data.error);
              } else {
                setFpStep("otp");
                setFpOtp("");
                setResendTimer(30);
                setOtpExpiry(300);
                setCanResend(false);
              }
            }}

          >
            Send OTP
          </button>
        </>
      )}

      {fpStep === "otp" && (
        <>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={fpOtp}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) setFpOtp(e.target.value);
            }}
            placeholder="Enter 6-digit OTP"
            className="w-full border rounded px-4 py-2 mb-3 text-[#442D1C] placeholder:text-[#442D1C]/60"
          />

          <p className="text-xs text-gray-500 mb-2">
            OTP expires in: {Math.floor(otpExpiry / 60)}:
            {(otpExpiry % 60).toString().padStart(2, "0")}
          </p>

          <button
            disabled={!canResend}
            className={`text-sm ${
               canResend
              ? "text-[#652810] hover:underline cursor-pointer"
              : "text-gray-400 cursor-not-allowed"
            }`}
            onClick={async () => {
              if (!canResend) return;

              const res = await fetch(
                "http://127.0.0.1:8000/api/accounts/forgot-password/send-otp/",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: fpEmail }),
                }
              );

              if (res.ok) {
                setResendTimer(30);
                setOtpExpiry(300);
                setCanResend(false);
                setFpError("");
              }
            }}
          >
            {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
          </button>


          <button
             className="w-full bg-[#652810] text-white py-2 rounded
             hover:bg-[#C85428] transition-colors duration-200"
            
            onClick={async () => {
              if (fpOtp.length !== 6) {
                setFpError("OTP should be of 6 digits");
                return;
              }
              const res = await fetch(
                "http://127.0.0.1:8000/api/accounts/forgot-password/verify-otp/",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: fpEmail, otp: fpOtp }),
                }
              );
              const data = await res.json();
              if (!res.ok) {
  setFpError(data.error);
} else {
  setFpError("");          // ✅ CLEAR OLD OTP ERROR
  setFpStep("reset");      // move to reset screen
}

            }}
          >
            Verify OTP
          </button>
        </>
      )}

      {fpStep === "reset" && (
        <>
          <div className="relative mb-3">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                checkPasswordStrength(e.target.value);
              }}

              className="w-full border border-[#652810] rounded px-4 py-2 pr-10
             text-[#442D1C] placeholder:text-[#442D1C]/60
             focus:outline-none focus:ring-2 focus:ring-[#652810]/40"
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2
             text-[#652810] hover:text-[#C85428] transition-colors"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>

          {passwordStrength && (
  <p
    className={`text-sm mb-2 ${
      passwordStrength === "weak"
        ? "text-red-600"
        : passwordStrength === "moderate"
        ? "text-orange-500"
        : "text-green-600"
    }`}
  >
    Password strength: {passwordStrength.toUpperCase()}
  </p>
)}


          <div className="relative mb-3">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-[#652810] rounded px-4 py-2 pr-10
             text-[#442D1C] placeholder:text-[#442D1C]/60
             focus:outline-none focus:ring-2 focus:ring-[#652810]/40"
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2
             text-[#652810] hover:text-[#C85428] transition-colors"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>

          

          <button
             className="w-full bg-[#652810] text-white py-2 rounded
             hover:bg-[#C85428] transition-colors duration-200"
            onClick={async () => {
              if (passwordStrength !== "strong") {
                setFpError("Password must be strong to continue");
                return;
              }

              if (newPassword !== confirmPassword) {
                setFpError("Passwords do not match");
                return;
              }

              const res = await fetch(
                "http://127.0.0.1:8000/api/accounts/forgot-password/reset-password/",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: fpEmail,
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                  }),
                }
              );
              const data = await res.json();
              if (!res.ok) setFpError(data.error);
              else setShowForgot(false);
            }}
          >
            Confirm
          </button>
        </>
      )}

      <button
        className="mt-4 text-sm text-gray-500
             hover:underline hover:text-[#652810]
             transition-colors"
        onClick={() => {
          setShowForgot(false);
          setFpError("");
          setFpEmail("");
          setFpOtp("");
          setFpStep("email");
          setNewPassword("");
          setConfirmPassword("");
          setPasswordStrength("");
          setResendTimer(30);
          setOtpExpiry(300);
          setCanResend(false);
        }}


      >
        Cancel
      </button>
    </div>
  </div>
)}

      
      </div>
   
  );
}
