"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffectSounds } from "@/hooks/useEffectSounds";

interface KeyAppearingProps {
  isVisible: boolean;
  onDone: () => void; // Called when animation is complete
}

export default function KeyAppearing({ isVisible, onDone }: KeyAppearingProps) {
  const triggerKeySound = useEffectSounds({ effect: "key-appearing" });

  useEffect(() => {
    if (!isVisible) return;
    triggerKeySound();
    // Auto-dismiss after 3 seconds
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-40 cursor-pointer"
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Pulsing glow */}
          <motion.div
            className="absolute w-48 h-48 rounded-full bg-yellow-400/20 blur-2xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Key */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/assets/images/golden-key.png"
              alt="A key appeared"
              width={200}
              height={200}
            />
          </motion.div>

          <motion.p
            className="absolute bottom-1/3 font-fell text-yellow-400 text-sm tracking-widest"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            The door is unlocked!
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
