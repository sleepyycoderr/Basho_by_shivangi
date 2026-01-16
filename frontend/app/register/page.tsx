"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";



import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";



export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  const [googleEmail, setGoogleEmail] = useState("");
  const [googleUsername, setGoogleUsername] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strengthText, setStrengthText] = useState("");
  const [strengthColor, setStrengthColor] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);


/* ✅ OTP STATE */
const [otp, setOtp] = useState("");
const [otpError, setOtpError] = useState("");

// ⏱ OTP TIMERS
const [resendTimer, setResendTimer] = useState(30);
const [canResend, setCanResend] = useState(false);
const [otpExpiry, setOtpExpiry] = useState(300); // 5 minutes



 const handleSendOtp = async () => {
  setError("");
  setSuccess("");
  setOtpLoading(true);
  if (!username.trim()) {
  setError("Username is required");
  setOtpLoading(false);
  return;
}
  if (!validateEmail(email)) {
    setError("Invalid email id entered");
    setOtpLoading(false);
    return;
  }

  const res = await fetch("http://127.0.0.1:8000/api/accounts/send-otp/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username }),
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error);
    setOtpLoading(false);
    return;
  }

  setSuccess("OTP sent successfully");
  setOtp("");
  setOtpSent(false);
  setResendTimer(30);
  setOtpExpiry(300);
  setCanResend(false);
  setOtpError("");
  setOtpSent(true);
  setOtpLoading(false);

};

// ⏱ Resend OTP timer (30s)
useEffect(() => {
  if (!otpSent) return;

  if (resendTimer > 0) {
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(timer);
  } else {
    setCanResend(true);
  }
}, [resendTimer, otpSent]);

// ⏱ OTP expiry timer (5 minutes)
useEffect(() => {
  if (!otpSent) return;

  if (otpExpiry > 0) {
    const timer = setTimeout(() => setOtpExpiry(otpExpiry - 1), 1000);
    return () => clearTimeout(timer);
  } else {
    setOtpError("OTP expired. Please resend OTP.");
    setCanResend(true);
  }
}, [otpExpiry, otpSent]);


<GoogleLogin
  onSuccess={(credentialResponse) => {
    if (!credentialResponse.credential) {
      setError("Google authentication failed");
      return;
    }

    const decoded: any = jwtDecode(credentialResponse.credential);
    const email = decoded.email;

    setGoogleEmail(email);

    fetch("http://127.0.0.1:8000/api/accounts/google-login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        localStorage.setItem("username", data.username);
        window.dispatchEvent(new Event("auth-changed"));
        router.replace("/");
      } else {
        setShowUsernameModal(true);
      }
    });
  }}
  onError={() => setError("Google authentication failed")}
/>



{showUsernameModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm">
      <h2 className="text-xl font-semibold mb-4">Choose a username</h2>

      <input
        type="text"
        value={googleUsername}
        onChange={(e) => setGoogleUsername(e.target.value)}
        placeholder="Username"
        className="w-full border rounded-lg px-4 py-2 mb-4"
      />

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        className="w-full bg-[var(--basho-terracotta)] text-white py-2 rounded-lg"
        onClick={async () => {
          const res = await fetch(
            "http://127.0.0.1:8000/api/accounts/google-register/",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: googleEmail,
                username: googleUsername,
              }),
            }
          );

          const data = await res.json();

          if (!res.ok) {
            setError(data.error);
            return;
          }

          localStorage.setItem("accessToken", data.access);
          localStorage.setItem("refreshToken", data.refresh);
          localStorage.setItem("username", data.username);

          router.replace("/");
        }}
      >
        Continue
      </button>
    </div>
  </div>
)}


  /* ================= EMAIL VALIDATION ================= */

  const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.(com|in|org|net)$/;
  return regex.test(email);
};
  
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
    setStrengthColor("");
    setPasswordStrength(0);
    return;
  }

  const strength = checkStrength(password1);
  setPasswordStrength(strength);

  if (strength === 1) {
    setStrengthText("Weak password");
    setStrengthColor("text-red-600");
  } else if (strength === 2) {
    setStrengthText("Moderate password");
    setStrengthColor("text-orange-500");
  } else if (strength === 3) {
    setStrengthText("Strong password");
    setStrengthColor("text-green-600");
  }
}, [password1]);


  const passwordsMatch =
    password1 && password2 && password1 === password2;

  const showPasswordRules = password1.length === 0;

  const handleRegister = async () => {
  setError("");

  if (passwordStrength !== 3) {
  setError("Password must be strong (8 characters, 1 uppercase, 1 special character)");
  setSuccess("");
  return;
}


  // ✅ CHECK FIRST
  if (otpExpiry <= 0) {
    setError("OTP expired. Please resend OTP.");
    setSuccess("");
    return;
  }

  const res = await fetch(
    "http://127.0.0.1:8000/api/accounts/register/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password: password1,
        otp,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    setError(data.error || "Invalid credentials - incorrect OTP");
    setSuccess(""); 
    return;
  }

  localStorage.setItem("accessToken", data.access);
  localStorage.setItem("refreshToken", data.refresh);
  localStorage.setItem("username", data.username);
  window.dispatchEvent(new Event("auth-changed"));

  router.replace("/");
};




  return (
    /* 🔒 FIXED BACKGROUND — NO RESIZE */
    <div className="min-h-screen flex items-center justify-center px-6
      bg-[linear-gradient(rgba(255,250,243,0.3),rgba(255,250,243,0.3)),url('/image_aish/home/home_pot.jpg')]
      bg-cover bg-center bg-no-repeat pb-24 pt-24">

      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-3xl px-10 py-12 shadow-sm border border-[var(--basho-divider)] h-240">

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
  onClick={handleSendOtp}
  disabled={otpLoading}
  className="w-full h-12 mb-2 rounded-full flex items-center justify-center gap-2
  border border-[var(--basho-terracotta)]
  text-[var(--basho-terracotta)]
  hover:bg-[var(--basho-terracotta)] hover:text-white
  transition-all duration-300 disabled:opacity-60"
>
  {otpLoading ? "Sending..." : "Send Verification Code"}
</button>

{success && <p className="text-green-600 text-sm">{success}</p>}
{error && <p className="text-red-600 text-sm">{error}</p>}


{/* otp timers */}
{otpSent && (
  <>
    {/* OTP INPUT */}
    <div className="relative mb-2">
      <Lock
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2b29b]"
      />

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Enter OTP"
        value={otp}
        maxLength={6}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");

          if (value.length < 6) {
            setOtp(value);
            setOtpError("OTP must be of 6 digits");
          } else {
            setOtp(value);
            setOtpError("");
          }
        }}
        className="w-full h-12 pl-11 pr-4 rounded-full bg-transparent border
        border-[var(--basho-divider)] text-black placeholder:text-[#c2b29b]
        focus:outline-none focus:border-[var(--basho-clay)]"
      />
    </div>

    {otpError && (
      <p className="text-left text-sm text-red-600 pl-2 mb-4">
        {otpError}
      </p>
    )}

    {/* OTP TIMERS */}
    <p className="text-xs text-gray-500 mb-2">
      OTP expires in: {Math.floor(otpExpiry / 60)}:
      {(otpExpiry % 60).toString().padStart(2, "0")}
    </p>

    <button
      disabled={!canResend}
      className={`text-sm mb-4 ${
        canResend
          ? "text-[#652810] hover:underline cursor-pointer"
          : "text-gray-400 cursor-not-allowed"
      }`}
      onClick={handleSendOtp}
    >
      {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
    </button>
  </>
)}



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
          
            <button
              type="button"
              disabled={
              !passwordsMatch ||
              !!emailError ||
              !otp ||
              otpExpiry <= 0 ||
              passwordStrength !== 3
            }


  onClick={handleRegister}
  className={`w-full h-12 rounded-full text-white flex items-center justify-center gap-2 text-lg
  transition-colors
  ${
  passwordsMatch &&
  !emailError &&
  otp &&
  otpExpiry > 0 &&
  passwordStrength === 3
    ? "bg-[var(--basho-terracotta)] hover:bg-[var(--basho-clay)]"
    : "bg-gray-300 cursor-not-allowed"
}
`}
>
  Create Account
  <ArrowRight size={18} />
</button>

          

          <p className="mt-10 text-sm text-[#c2b29b]">
            Handcrafted with care
          </p>
        </div>
      </div>
    </div>
  );
}
