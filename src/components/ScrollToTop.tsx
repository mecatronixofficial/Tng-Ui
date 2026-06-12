"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowUp, FaStore } from "react-icons/fa";

export default function ScrollToTop() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          aria-label="Scroll to top"
          className="group fixed bottom-24 right-5 z-40 flex items-center gap-2 rounded-full border border-secondary/30 bg-primary-900 p-1.5 pr-3 text-white shadow-warm transition hover:bg-primary-800"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-white transition group-hover:scale-105">
            <FaArrowUp className="h-3.5 w-3.5" />
          </span>
          <span className="hidden text-left sm:block">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest-x text-secondary-light">
              <FaStore className="h-3 w-3" />
              Top
            </span>
            <span className="block text-xs font-extrabold">Cloth store</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
