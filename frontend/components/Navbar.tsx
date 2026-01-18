"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CartIcon } from "@/components/shared/CartIcon";
import { logout, isLoggedIn, getUsername } from "@/lib/auth";
import { refreshAccessToken } from "@/lib/auth";
import MusicSettingsModal from "@/components/MusicSettingsModal";
import { VAPI_BASE } from "@/lib/api";


const DEFAULT_AVATAR = "/image_aish/avatars/p1.png";


export default function Navbar() {
  const [authReady, setAuthReady] = useState(false);
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string>(DEFAULT_AVATAR);
  const [showMusicSettings, setShowMusicSettings] = useState(false);




/* ================= AUTH REFRESH ================= */
const refreshAuth = async () => {
  const logged = isLoggedIn();
  const user = getUsername();

  setLoggedIn(logged);
  setUsername(user);

  if (!logged) {
    setProfileImage(DEFAULT_AVATAR);
    return;
  }

  try {
  let token = localStorage.getItem("accessToken");

  let res = await fetch("${VAPI_BASE}/api/accounts/me/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    if (!token) throw new Error("Auth failed");

    res = await fetch("${VAPI_BASE}/api/accounts/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) throw new Error("Unauthorized");

  const data = await res.json();

  setProfileImage(
    data.avatar
      ? `/image_aish/avatars/${data.avatar}`
      : DEFAULT_AVATAR
  );
} catch {
  setProfileImage(DEFAULT_AVATAR);
}
};




  const handleLogout = () => {
  logout();
  setUsername(null);
  setLoggedIn(false);
  router.replace("/");
};

useEffect(() => {
  if (!authReady) return;

  const token = localStorage.getItem("accessToken");
  if (!token) return;

  refreshAuth();
}, [authReady]);



useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 768);
  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);



useEffect(() => {
  if (typeof window === "undefined") return;

  // wait until browser & localStorage are fully ready
  const id = requestAnimationFrame(() => {
    setAuthReady(true);
  });

  return () => cancelAnimationFrame(id);
}, []);



useEffect(() => {
  if (!authReady) return;

  const syncAuth = () => {
    refreshAuth();
  };

  window.addEventListener("focus", syncAuth);
  window.addEventListener("storage", syncAuth);

  // ✅ custom event for same-tab auth updates
  window.addEventListener("auth-changed", syncAuth);

  return () => {
    window.removeEventListener("focus", syncAuth);
    window.removeEventListener("storage", syncAuth);
    window.removeEventListener("auth-changed", syncAuth);
  };
}, [authReady]);


  /* ================= PROFILE MENU ================= */
  const [showProfileMenu, setShowProfileMenu] = useState(false);





  /* ================= CHANGE USERNAME ================= */
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const handleChangeUsername = async () => {
  setUsernameError("");

  if (!newUsername.trim()) {
    setUsernameError("Username cannot be empty");
    return;
  }

  const res = await fetch(
    "${VAPI_BASE}/api/accounts/change-username/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ username: newUsername }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    setUsernameError(data.error || "Username already taken");
    return;
  }

  localStorage.setItem("username", data.username);
  setUsername(data.username);

  setShowChangeUsername(false);
  setNewUsername("");
};




const saveAvatar = async (url: string) => {
  const avatarName = url.split("/").pop();

  if (!avatarName) {
    alert("Invalid avatar");
    return;
  }

  try {
    const res = await fetch(
      "${VAPI_BASE}/api/accounts/set-avatar/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ avatar: avatarName }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to set profile picture");
      return;
    }

    // ✅ Persist visually
    setProfileImage(`/image_aish/avatars/${data.avatar}`);

    setShowAvatarModal(false);
  } catch {
    alert("Failed to update profile picture");
  }
};




return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--basho-divider)]">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center h-10 overflow-hidden -ml-4">
          <Image
            src="/Images/branding/logo.jpg"
            alt="Basho by Shivangi"
            width={140}
            height={60}
            priority
          />
        </Link>

        {/* MOBILE MENU BUTTON */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#652810] text-2xl"
            >
              ☰
            </button>
          )}

        <div className="hidden md:flex items-center gap-6">

          


          {/* NAV */}
          {/* NAV */}
<nav className="flex items-center gap-6 text-[13px] tracking-[0.18em] uppercase text-[#652810]">


            <Link href="/shop">SHOP</Link>
            <Link href="/custom-orders" className="text-center leading-tight">
              <span className="block">CUSTOM</span>
              <span className="block">ORDER</span>
            </Link>
            <Link href="/workshops">WORKSHOPS</Link>
            <Link href="/experiences">EXPERIENCES</Link>
            <Link href="/studio">STUDIO</Link>
            <Link href="/gallery">GALLERY</Link>
            <Link href="/about" className="text-center leading-tight">
              <span className="block">ABOUT</span>
              <span className="block">US</span>
            </Link>
            <Link href="/corporate">CORPORATE</Link>
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-4 ml-4 relative">
            <CartIcon />

            {loggedIn ? (
              <>
                <div className="flex items-center gap-3 relative text-[#652810]">
                  <span>Hi, {username}</span>

                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-9 h-9 rounded-full cursor-pointer border"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  />

                  {/* PROFILE MENU */}
                  {showProfileMenu && (
                    <div className="absolute right-0 top-12 w-56 bg-[#F3EDE8] shadow-lg rounded-xl p-3 z-50">
                      <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded "
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowChangeUsername(true);
                        }}
                      >
                         Change Username
                      </button>


                      <button
  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
  onClick={() => {
    setShowProfileMenu(false);
    router.push("/profile");
  }}
>
  View Profile
</button>

<button
  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
  onClick={() => {
    setShowProfileMenu(false);
    setShowMusicSettings(true);
  }}
>
  BGM Setting
</button>





                      <button
  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
  onClick={() => {
    setShowProfileMenu(false);
    setShowAvatarModal(true);
  }}
>
   Change Profile Picture
</button>






                      <hr className="my-2" />

                      <button
  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded"
  onClick={() => {
    setShowProfileMenu(false);
    setShowLogoutPopup(true);
  }}
>
   Logout
</button>

                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm border border-[#652810] text-[#652810]"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="px-4 py-2 text-sm border border-[#652810] text-[#652810]"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================= CHANGE USERNAME MODAL ================= */}
      <AnimatePresence>
        {showChangeUsername && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-[90%] max-w-sm"
            >
              <h3 className="text-lg font-semibold mb-4 text-[#652810]">
                Change Username
              </h3>

              <input
                type="text"
                placeholder="Enter new username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full border rounded px-4 py-2 mb-3 text-[#652810]"
              />

              {usernameError && (
                <p className="text-red-600 text-sm mb-2 text-[#652810]">
                  {usernameError}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowChangeUsername(false)}
                  className="px-4 py-2 border rounded text-[#652810]"
                >
                  Cancel
                </button>

                <button
                  onClick={handleChangeUsername}
                  className="px-4 py-2 bg-[#652810] text-white rounded"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


{/* ================= LOGOUT CONFIRMATION ================= */}
      <AnimatePresence>
        {showLogoutPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm text-center"
            >
              <h3 className="text-lg font-semibold mb-4 text-[#652810]">
                Are you sure you want to logout?
              </h3>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowLogoutPopup(false);
                    handleLogout();
                  }}
                  className="px-5 py-2 rounded-md bg-red-600 text-white"
                >
                  Yes
                </button>

                <button
                  onClick={() => setShowLogoutPopup(false)}
                  className="px-5 py-2 rounded-md border text-[#652810]"
                >
                  No
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= AVATAR MODAL ================= */}
{showAvatarModal && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl p-6 w-[90%] max-w-lg">

      <h3 className="text-lg font-semibold mb-4 text-[#652810]">
        Choose Profile Picture
      </h3>

     

      {/* 🖼 PRESET AVATARS — 5 PER ROW */}
      
  <div className="grid grid-cols-5 gap-4 mb-4">
    {[
      "/image_aish/avatars/p1.png",
      "/image_aish/avatars/p2.png",
      "/image_aish/avatars/p3.png",
      "/image_aish/avatars/p4.png",
      "/image_aish/avatars/p5.png",
      "/image_aish/avatars/p6.png",
      "/image_aish/avatars/p7.png",
      "/image_aish/avatars/p8.png",
      "/image_aish/avatars/p9.png",
      "/image_aish/avatars/p10.png",
      "/image_aish/avatars/p11.png",
      "/image_aish/avatars/p12.png",
      "/image_aish/avatars/p13.png",
      "/image_aish/avatars/p14.png",
      "/image_aish/avatars/p15.png",
      "/image_aish/avatars/p16.png",
      "/image_aish/avatars/p17.png",
    ].map((img) => (
      <img
        key={img}
        src={img}
        className="w-14 h-14 rounded-full cursor-pointer border hover:ring-2 hover:ring-[#652810]"
        onClick={() => saveAvatar(img)}
      />
    ))}
  </div>




  

      

      <button
        className="mt-4 w-full border rounded py-2 text-[#652810]"
        onClick={() => setShowAvatarModal(false)}
      >

        Cancel
      </button>

    </div>
  </div>
)}

{/* ================= MOBILE NAV MENU ================= */}
<AnimatePresence>
  {isMobile && mobileMenuOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="md:hidden bg-white border-t border-[var(--basho-divider)]"
    >
      <nav className="flex flex-col px-8 py-6 gap-4 text-sm tracking-widest uppercase text-[#652810]">
        <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>SHOP</Link>
        <Link href="/workshops" onClick={() => setMobileMenuOpen(false)}>WORKSHOPS</Link>
        <Link href="/experiences" onClick={() => setMobileMenuOpen(false)}>EXPERIENCES</Link>
        <Link href="/studio" onClick={() => setMobileMenuOpen(false)}>STUDIO</Link>
        <Link href="/gallery" onClick={() => setMobileMenuOpen(false)}>GALLERY</Link>
        <Link href="/about" onClick={() => setMobileMenuOpen(false)}>ABOUT US</Link>
        <Link href="/corporate" onClick={() => setMobileMenuOpen(false)}>CORPORATE</Link>

        <hr className="my-4" />

        {!loggedIn ? (
          <>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setShowLogoutPopup(true);
            }}
            className="text-left text-red-600"
          >
            Logout
          </button>
        )}
      </nav>
    </motion.div>
  )}
</AnimatePresence>

{/* ================= MUSIC SETTINGS MODAL ================= */}
<MusicSettingsModal
  open={showMusicSettings}
  onClose={() => setShowMusicSettings(false)}
/>



    </header>
  );

}





  






