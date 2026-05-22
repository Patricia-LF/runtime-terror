"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAudioStore } from "@/store/useAudioStore";
import { useGameStore } from "@/store/useGameStore";
import type { SoundId } from "@/lib/audio";

const phrases: { text: string; audio: SoundId }[] = [
  {
    text: "I've been waiting for you...",
    audio: "dolltalk-waiting",
  },
  {
    text: "Do you want to play?",
    audio: "dolltalk-play",
  },
  {
    text: "Don't leave me alone...",
    audio: "dolltalk-alone",
  },
];

export default function RockingChair() {
  const [isTalking, setIsTalking] = useState(false);
  const [hasTalked, setHasTalked] = useState(false);
  const [isJumpscare, setIsJumpscare] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState("");
  const { play, fadeIn, fadeOut } = useAudioStore();
  const currentRoom = useGameStore((s) => s.currentRoom);
  const pendingTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      pendingTimeoutsRef.current.forEach(clearTimeout);
      pendingTimeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (currentRoom === "dolls") {
      fadeIn("music-box", 2000);
    } else {
      fadeOut("music-box", 1000);
    }
  }, [currentRoom, fadeIn, fadeOut]);

  const handleClick = (): void => {
    if (isTalking || isJumpscare) return;

    const willJumpscare = hasTalked && Math.random() < 0.3;

    if (willJumpscare) {
      play("loud-jumpscare");

      setIsJumpscare(true);

      const timeoutId = setTimeout(() => setIsJumpscare(false), 1000);
      pendingTimeoutsRef.current.push(timeoutId);
    } else {
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      setCurrentPhrase(randomPhrase.text);
      play(randomPhrase.audio);
      setIsTalking(true);
      setHasTalked(true); // Mark that doll has talked at least once
      const timeoutId = setTimeout(() => setIsTalking(false), 3000);
      pendingTimeoutsRef.current.push(timeoutId);
    }
  };

  return (
    <>
      {/* Jumpscare */}
      <AnimatePresence>
        {isJumpscare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <img
              src="/assets/images/jumpscare-face.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute bottom-15 left-1/3 -translate-x-1/2 cursor-pointer z-20"
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ originY: 1 }}
        onClick={handleClick}
      >
        {/* Speech bubble */}
        <AnimatePresence>
          {isTalking && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-black text-sm px-4 py-2 min-h-11 min-w-11 rounded-lg whitespace-nowrap font-fell"
            >
              {currentPhrase}
            </motion.div>
          )}
        </AnimatePresence>

        <Image
          className="items-center"
          src="/assets/images/rocking-doll.png"
          alt=""
          width={200}
          height={200}
        />

        {/* Click prompt */}
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center text-grey text-xs font-fell tracking-widest mt-2"
        >
          Click me...
        </motion.p>
      </motion.div>
    </>
  );
}
