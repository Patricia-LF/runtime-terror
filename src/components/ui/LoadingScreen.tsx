"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999] gap-8">
      {/* Title */}
      <h1 className="font-eater text-red-800 text-4xl md:text-6xl">
        Runtime Terror
      </h1>

      {/* Loading bar */}
      <div className="flex flex-col items-center gap-3 w-64 md:w-80">
        <p className="font-fell text-grey text-sm tracking-widest animate-pulse">
          Entering the darkness...
        </p>

        {/* Bar container */}
        <div className="w-full h-6 rounded-full border border-red-900 bg-black/60 overflow-hidden">
          {/* Indeterminate — loops back and forth */}
          <motion.div
            className="h-full w-1/3 bg-red-900 rounded-full"
            animate={{ x: ["0%", "200%", "0%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Dripping blood effect on bar */}
      <div className="flex gap-3">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-red-900 rounded-full"
            animate={{ height: ["8px", "24px", "8px"] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
