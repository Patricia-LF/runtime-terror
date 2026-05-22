"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { FadeOverlay } from "@/components/shared/FadeOverlay";
import { useFadeStore } from "@/store/useFadeStore";

interface DoorTransitionProps {
  buttonText: string;
  doorImage?: string;
  animated?: boolean;
  positionClass?: string;
  sizeClass?: string;
  isLocked?: boolean;
}

export default function DoorTransition({
  buttonText,
  doorImage,
  animated = true,
  positionClass = "bottom-45 left-1/2 -translate-x-1/2 md:bottom-35",
  sizeClass = "w-48 h-80", // Default size
  isLocked = false,
}: DoorTransitionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isFading, setFading } = useFadeStore();
  const { goToNextRoom } = useGameStore();

  const DOOR_ANIMATION_DURATION = animated ? 1200 : 0;
  const FADE_OUT_DURATION = 800;

  // Start door animation, then trigger fade-out and room transition
  const handleClick = (): void => {
    if (isLocked) return;
    setIsOpen(true);
    setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        goToNextRoom();
      }, FADE_OUT_DURATION);
    }, DOOR_ANIMATION_DURATION);
  };

  return (
    <>
      <FadeOverlay isActive={isFading} duration={0.8} />

      <div
        style={{ perspective: "1200px" }}
        className={`absolute ${positionClass} flex flex-col items-center justify-center gap-4`}
      >
        {animated ? (
          <>
            {/* Wrapper with door size */}
            <div className={`relative ${sizeClass}`}>
              {/* Background fills parent automatically */}
              <div className="absolute inset-2 bg-black" />

              <motion.button
                onClick={!isOpen && !isLocked ? handleClick : undefined}
                disabled={isLocked}
                className={`absolute inset-0 ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
                aria-label="Go to next room"
                animate={{ rotateY: isOpen ? -110 : 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                style={{
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                }}
              >
                {doorImage ? (
                  <img
                    src={doorImage}
                    alt="Door"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // CSS door fallback
                  <div className="absolute inset-0 bg-linear-to-b from-stone-900 to-stone-950 border-2 border-stone-700 rounded-t-lg flex flex-col items-center justify-center gap-6">
                    <div className="w-36 h-24 border border-stone-700 rounded opacity-40" />
                    <div className="w-36 h-32 border border-stone-700 rounded opacity-40" />
                    <div className="absolute right-4 top-1/2 w-3 h-3 rounded-full bg-yellow-700" />
                  </div>
                )}
              </motion.button>
            </div>
          </>
        ) : (
          /* Arrow mode - static display */
          <button
            onClick={handleClick}
            aria-label="Go to next room"
            className="flex flex-col items-center justify-center gap-4 cursor-pointer group"
          >
            <div
              className="text-6xl text-gray-400"
              style={{
                animation: "bounce-diagonal 1s infinite",
              }}
            >
              ↗
            </div>
            {doorImage && (
              <img
                src={doorImage}
                alt="Room entrance"
                className="w-48 h-48 object-cover"
              />
            )}
          </button>
        )}

        <p
          className={`font-fell text-grey text-sm tracking-widest animate-pulse transition-opacity ${!animated || !isOpen
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
            }`}
        >
          {buttonText}
          {isLocked && (
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none text-2xl text-yellow-300 drop-shadow-lg">
              🔒
            </span>
          )}
        </p>
      </div>
    </>
  );
}
