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

interface RockingChairProps {
  onJumpscareComplete?: () => void;
}

export default function RockingChair({
  onJumpscareComplete,
}: RockingChairProps) {
  const [isTalking, setIsTalking] = useState(false);
  const [isJumpscare, setIsJumpscare] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState("");
  const { play } = useAudioStore();
  const pendingTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [phraseCounts, setPhraseCounts] = useState<number[]>(
    Array(phrases.length).fill(0),
  );

  const [lastPhraseIndex, setLastPhraseIndex] = useState<number | null>(null);
  const [totalTalks, setTotalTalks] = useState(0);

  useEffect(() => {
    return () => {
      pendingTimeoutsRef.current.forEach(clearTimeout);
      pendingTimeoutsRef.current = [];
    };
  }, []);


  const handleClick = (): void => {
    if (isTalking || isJumpscare) return;

    // Force jumpscare after 6 phrases
    const forceJumpscare = totalTalks >= 6;

    // Increase the chance by every click
    const jumpscareChance =
      totalTalks >= 5
        ? 0.7
        : totalTalks >= 4
          ? 0.45
          : totalTalks >= 2
            ? 0.25
            : 0.1;

    const willJumpscare = forceJumpscare || Math.random() < jumpscareChance;

    if (willJumpscare) {
      play("loud-jumpscare");
      setIsJumpscare(true);

      const timeoutId = setTimeout(() => {
        setIsJumpscare(false);
        onJumpscareComplete?.();
      }, 1000);

      pendingTimeoutsRef.current.push(timeoutId);
      return;
    }

    // Get phrases that have been used less than 2 times
    const availableIndexes = phrases
      .map((_, index) => index)
      .filter((index) => phraseCounts[index] < 2 && index !== lastPhraseIndex);

    // Fallback if the only remaining phrase is the previous one
    const validIndexes =
      availableIndexes.length > 0
        ? availableIndexes
        : phrases
            .map((_, index) => index)
            .filter((index) => phraseCounts[index] < 2);

    if (validIndexes.length === 0) {
      return;
    }
    const randomIndex =
      validIndexes[Math.floor(Math.random() * validIndexes.length)];

    const selectedPhrase = phrases[randomIndex];

    setCurrentPhrase(selectedPhrase.text);
    play(selectedPhrase.audio);

    setLastPhraseIndex(randomIndex);

    setPhraseCounts((prev) => {
      const updated = [...prev];
      updated[randomIndex]++;
      return updated;
    });

    setTotalTalks((prev) => prev + 1);

    setIsTalking(true);

    const timeoutId = setTimeout(() => {
      setIsTalking(false);
    }, 3000);

    pendingTimeoutsRef.current.push(timeoutId);
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

      <motion.button
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
      </motion.button>
    </>
  );
}
