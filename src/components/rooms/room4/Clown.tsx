"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DoorTransition from "@/components/shared/DoorTransition";
import { useEffectSounds } from "@/hooks/useEffectSounds";
import { useGameStore } from "@/store/useGameStore";

type Balloon = {
  id: string;
  x: number;
  y: number;
};

type Phase = "intro" | "playing" | "clown" | "done";

const INTRO_TEXT =
  "Pop the balloons before they disappear — or he gets closer.";

function IntroText({ onComplete }: { onComplete: () => void }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(INTRO_TEXT.slice(0, i + 1));
      i++;
      if (i >= INTRO_TEXT.length) {
        clearInterval(interval);
        setTimeout(onComplete, 1500);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center font-fell text-grey text-2xl text-center px-12"
    >
      {displayed}
    </motion.p>
  );
}
const GAME_DURATION = 30; // seconds
const MAX_MISSED = 5; // Clown fills screen after 5 missed balloons

export default function Clown() {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [missed, setMissed] = useState(0);
  const [phase, setPhase] = useState<Phase>("intro");
  const poppedIdsRef = useRef<Set<string>>(new Set());
  const triggerDanger = useEffectSounds({ effect: "danger" });
  const triggerClownLaugh = useEffectSounds({ effect: "clown-laugh" });
  const pendingTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setMissed(0);
    setBalloons([]);
    setTimeLeft(GAME_DURATION);
  }, []);

  // Spawn balloons only during playing phase
  // Countdown timer during playing phase
  useEffect(() => {
    if (phase !== "playing") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase("clown"); // Time's up — clown takes over
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const interval = setInterval(() => {
      const newBalloon: Balloon = {
        id: crypto.randomUUID(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 10,
      };
      setBalloons((prev) => [...prev, newBalloon]);

      // Auto-remove balloon after 1 second if not clicked
      const timeout = setTimeout(() => {
        setBalloons((prev) => prev.filter((b) => b.id !== newBalloon.id));

        const wasPopped = poppedIdsRef.current.has(newBalloon.id);

        if (wasPopped) {
          poppedIdsRef.current.delete(newBalloon.id);
          return;
        }

        setMissed((prev) => {
          const next = prev + 1;
          if (next >= MAX_MISSED) setPhase("clown");
          return next;
        });
      }, 1500);

      timeouts.push(timeout);
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, [phase]);

  const handleBalloonClick = (id: string): void => {
    triggerDanger();
    poppedIdsRef.current.add(id);
    setBalloons((prev) => prev.filter((b) => b.id !== id));
  };

  // Clown scale based on missed balloons
  const clownScale = 0.1 + (missed / MAX_MISSED) * 0.5;

  useEffect(() => {
    return () => {
      pendingTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-black">
      {/* Intro text */}
      <AnimatePresence>
        {phase === "intro" && (
          <IntroText onComplete={() => setPhase("playing")} />
        )}
      </AnimatePresence>

      {phase === "playing" && (
        <motion.p
          className="absolute top-4 left-1/2 -translate-x-1/2 font-fell text-grey text-lg tracking-widest"
          animate={{ opacity: timeLeft <= 10 ? [0.5, 1, 0.5] : 1 }}
          transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
        >
          {timeLeft}s
        </motion.p>
      )}

      {/* Clown */}
      {phase !== "intro" && (
        <>
          <motion.img
            draggable="false"
            src="/assets/images/clown1.png"
            alt=""
            className="absolute bottom-50 left-1/2 max-w-full max-h-full object-contain md:bottom-0 z-10"
            initial={{ opacity: 0, scale: 0.1, x: "-50%" }}
            animate={{
              scale: phase === "clown" ? 2 : clownScale,
              opacity: missed === 0 ? 0 : 1,
              // Slide off screen to the right when door is visible
              x: phase === "done" ? "100vw" : "-50%",
            }}
            transition={{
              duration: phase === "clown" ? 2 : 0.5,
              ease: "easeInOut",
            }}
            onAnimationComplete={() => {
              if (phase === "clown") {
                triggerClownLaugh();
                // Show door after clown fills screen
                const t = setTimeout(() => {
                  setPhase("done");
                }, 3000);
                pendingTimeoutsRef.current.push(t);
              }
            }}
          />

          {/* Balloons */}
          <AnimatePresence>
            {phase === "playing" &&
              balloons.map((balloon) => (
                <motion.button
                  key={balloon.id}
                  onClick={() => handleBalloonClick(balloon.id)}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ left: `${balloon.x}%`, top: `${balloon.y}%` }}
                  className="absolute cursor-pointer z-20"
                  aria-label="Pop balloon"
                >
                  <img
                    draggable="false"
                    src="/assets/images/balloon3.png"
                    alt=""
                    width={80}
                    height={80}
                  />
                </motion.button>
              ))}
          </AnimatePresence>

          {/* Door */}
          {phase === "done" && <DoorTransition buttonText="Escape..." />}
        </>
      )}
    </div>
  );
}
