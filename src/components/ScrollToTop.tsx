"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronUp } from "react-icons/fa";

export default function ScrollToTop() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="fixed bottom-[6.5rem] right-6 z-40 grid h-12 w-12 place-items-center rounded bg-gradient-to-br from-primary-500 to-primary-700 shadow-[0_6px_24px_-4px_rgba(79,70,229,0.5)] transition"
        >
          <FaChevronUp className="h-4 w-4 text-white" />
          {/* subtle shimmer line */}
          <span className="absolute inset-x-2 top-1.5 h-px rounded-full bg-white/30" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
