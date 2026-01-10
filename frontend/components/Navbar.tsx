"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { CartIcon } from "@/components/shared/CartIcon";
import { logout, isLoggedIn, getUsername } from "@/lib/auth";

import { Eye, EyeOff } from "lucide-react";



export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);


  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [showChangePassword, setShowChangePassword] = useState(false);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [passwordError, setPasswordError] = useState("");


  

const [uploading, setUploading] = useState(false);

const [imageSrc, setImageSrc] = useState<string | null>(null);
const [crop, setCrop] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
const [showCropModal, setShowCropModal] = useState(false);



const resetSensitiveUI = () => {
  setShowChangePassword(false);
  setCurrentPassword("");
  setNewPassword("");
  setPasswordError("");
  
};



  /* ================= AUTH REFRESH ================= */
  const refreshAuth = () => {
    setLoggedIn(isLoggedIn());
    setUsername(getUsername());

    // 🔐 reset sensitive popups on auth refresh
  resetSensitiveUI();
  };

  useEffect(() => {
    refreshAuth();
    resetSensitiveUI();
  }, [pathname]);

  const handleLogout = () => {
    logout();
    resetSensitiveUI();
    refreshAuth();
    router.replace("/");
  };

  /* ================= PROFILE MENU ================= */
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [profileImage, setProfileImage] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("profileImage") || "/default-avatar.png"
      : "/default-avatar.png"
  );

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
      "http://127.0.0.1:8000/api/accounts/change-username/",
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

    // ✅ Update UI instantly
    localStorage.setItem("username", data.username);
    setUsername(data.username);

    setShowChangeUsername(false);
    setNewUsername("");
  };

/* ================= CHANGE PASSWORD ================= */
  const handleChangePassword = async () => {
  setPasswordError("");

  if (!currentPassword || !newPassword) {
    setPasswordError("All fields are required");
    return;
  }

  const res = await fetch(
    "http://127.0.0.1:8000/api/accounts/change-password/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    setPasswordError(data.error || "Failed to change password");
    return;
  }

 

  setShowChangePassword(false);
  setCurrentPassword("");
  setNewPassword("");
};



  const uploadCustomAvatar = async (file?: File) => {
  if (!file) return;

  // ✅ SIZE VALIDATION (2MB)
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  if (file.size > MAX_SIZE) {
    alert("Image size must be less than 2 MB");
    return;
  }

  // ✅ TYPE VALIDATION
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    alert("Only JPG, PNG, or WEBP images are allowed");
    return;
  }

  const [profileImage, setProfileImage] = useState(
  typeof window !== "undefined"
    ? localStorage.getItem("profileImage") || "/image_aish/avatars/p1.png"
    : "/image_aish/avatars/p1.png"
);


  const formData = new FormData();
  formData.append("image", file);

  setUploading(true);

  try {
    const res = await fetch(
      "http://127.0.0.1:8000/api/accounts/upload-profile-picture/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Upload failed");
      return;
    }

    // ✅ SAVE RESULT
    setProfileImage(data.profile_image);
    localStorage.setItem("profileImage", data.profile_image);
    setShowAvatarModal(false);
  } finally {
    setUploading(false);
  }
};


const saveAvatar = (url: string) => {
  setProfileImage(url);
  localStorage.setItem("profileImage", url);
  setShowAvatarModal(false);
};


  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--basho-divider)]">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center h-10 overflow-hidden">
          <Image
            src="/image_aish/basho_logo.jpg"
            alt="Basho by Shivangi"
            width={140}
            height={60}
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-6">

          {/* NAV */}
          <nav className="flex items-center gap-8 text-sm tracking-widest uppercase text-[#652810]">
            <Link href="/shop">SHOP</Link>
            <Link href="/workshops">WORKSHOPS</Link>
            <Link href="/experiences">EXPERIENCES</Link>
            <Link href="/studio">STUDIO</Link>
            <Link href="/gallery">GALLERY</Link>
            <Link href="/about">ABOUT US</Link>
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
    setShowChangePassword(true);
  }}
>
  Change Password
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

{/* ================= CHANGE PASSWORD MODAL ================= */}
    <AnimatePresence>
      {showChangePassword && (
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
              Change Password
            </h3>

            <div className="relative mb-3">
  <input
    type={showCurrentPassword ? "text" : "password"}
    placeholder="Current password"
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
    className="w-full border rounded px-4 py-2 pr-10 text-[#652810]"
  />

  <button
    type="button"
    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a49a8a] hover:text-[#652810]"
  >
    {showCurrentPassword ? <Eye size={18} /> : <EyeOff size={18} />}
  </button>
</div>


            <div className="relative mb-3">
  <input
    type={showNewPassword ? "text" : "password"}
    placeholder="New password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    className="w-full border rounded px-4 py-2 pr-10 text-[#652810]"
  />

  <button
    type="button"
    onClick={() => setShowNewPassword(!showNewPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a49a8a] hover:text-[#652810]"
  >
    {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
  </button>
</div>


            {passwordError && (
              <p className="text-red-600 text-sm mb-2">
                {passwordError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  resetSensitiveUI();
                }}
                className="px-4 py-2 border rounded text-[#652810]"
              >
                Cancel
              </button>


              <button
                onClick={handleChangePassword}
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

      {/* 🔄 LOADING SPINNER */}
      {uploading && (
        <div className="flex justify-center items-center py-8">
          <div className="w-10 h-10 border-4 border-[#652810] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* 🖼 PRESET AVATARS — 5 PER ROW */}
      {!uploading && (
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
)}



  

      

      <button
        className="mt-4 w-full border rounded py-2 text-[#652810]"
        onClick={() => setShowAvatarModal(false)}
        disabled={uploading}
      >
        Cancel
      </button>

    </div>
  </div>
)}

    </header>
  );

}





  






