"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ClayLoader from "@/components/ClayLoader";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname(); // triggers effect on route change

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Show loader on route change
  useEffect(() => {
    // Show loader immediately on path change
    setLoading(true);

    // Hide loader after small delay
    const timer = setTimeout(() => setLoading(false), 1500); // adjust delay for animation
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <ClayLoader />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content hidden while loader is active */}
      <div style={{ display: loading ? "none" : "block" }}>{children}</div>
    </>
  );
}
