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
          whileTap={{ scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+4.75rem)] right-5 z-40 grid h-10 w-10 place-items-center rounded-full border border-primary-100 bg-white text-primary-600 shadow-soft transition hover:border-primary-300 sm:bottom-[6.5rem] sm:right-6 sm:h-11 sm:w-11"
        >
          <FaChevronUp className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
