"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Fog from "@/components/effects/Fog";
import { Bat } from "@/components/effects/Bats";
import DoorTransition from "@/components/shared/DoorTransition";
import ZombieHand from "@/components/rooms/room1/ZombieHand";
import { useEffectSounds } from "@/hooks/useEffectSounds";
import KeyAppearing from "@/components/shared/KeyAppearing";
import { useIsMobile } from "@/hooks/useIsMobile";

type GravestoneEffect = "correct" | "bats" | "shake" | "thunder";

interface Gravestone {
  id: number;
  src: string;
  alt: string;
  effect: GravestoneEffect;
  showOnMobile: boolean;
  // Position as percentage — bottom half of screen
  position: {
    bottom: string;
    left?: string;
    right?: string;
  };
  // Separate mobile position
  mobilePosition?: {
    // Optional — only needed for stones visible on mobile
    bottom: string;
    left?: string;
    right?: string;
  };
  size: { width: number; height: number };
}

const GRAVESTONES: Gravestone[] = [
  {
    id: 1,
    src: "/assets/images/gravestone2.png",
    alt: "",
    effect: "bats",
    showOnMobile: false,
    position: { bottom: "35%", left: "42%" },
    size: { width: 80, height: 110 },
  },
  {
    id: 2,
    src: "/assets/images/gravestone3.png",
    alt: "",
    effect: "shake",
    showOnMobile: true,
    position: { bottom: "15%", left: "48%" },
    mobilePosition: { bottom: "15%", right: "10%" },
    size: { width: 100, height: 140 },
  },
  {
    id: 3,
    src: "/assets/images/gravestone4.png",
    alt: "",
    effect: "correct",
    showOnMobile: true,
    position: { bottom: "24%", left: "28%" },
    mobilePosition: { bottom: "30%", left: "20%" },
    size: { width: 100, height: 120 },
  },
  {
    id: 4,
    src: "/assets/images/gravestone1.png", // Silhouette — smaller, further away
    alt: "",
    effect: "thunder",
    showOnMobile: true,
    position: { bottom: "38%", right: "40%" },
    mobilePosition: { bottom: "35%", right: "28%" },
    size: { width: 60, height: 80 },
  },
];

export default function Graveyard() {
  const [sunkenStones, setSunkenStones] = useState<Set<number>>(new Set());
  const [shaking, setShaking] = useState(false);
  const [handVisible, setHandVisible] = useState(false);
  const [batsTriggered, setBatsTriggered] = useState(false);
  const [zombieTriggered, setZombieTriggered] = useState(false);
  const [keyVisible, setKeyVisible] = useState(false);
  const [keyCollected, setKeyCollected] = useState(false);

  const handEmeregedSound = useEffectSounds({ effect: "danger" });
  const creakSound = useEffectSounds({ effect: "creaking-gate" });
  const thunderSound = useEffectSounds({ effect: "thunder" });

  const handleGravestoneClick = (stone: Gravestone): void => {
    if (sunkenStones.has(stone.id)) return;

    setSunkenStones((prev) => new Set(prev).add(stone.id));

    switch (stone.effect) {
      case "correct":
        setZombieTriggered(true);
        break;
      case "bats":
        setBatsTriggered(true);
        setTimeout(() => setBatsTriggered(false), 3000);
        break;
      case "shake":
        creakSound();
        setShaking(true);
        setTimeout(() => setShaking(false), 600);
        break;
      case "thunder":
        thunderSound();
        break;
    }
  };

  const isMobile = useIsMobile();

  return (
    <motion.div
      className="absolute inset-0 bg-[url('/assets/images/graveyard-night.png')] bg-cover bg-position-[center_left_-250px] md:bg-center"
      animate={shaking ? { x: [-5, 5, -5, 5, -3, 3, 0] } : { x: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <Fog opacity={0.6} />

      {batsTriggered && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Bat
            startX="0%"
            startY="0%"
            animateX={["-200px", "110vw"]}
            animateY={["60vh", "10vh"]}
            duration={3}
            depth={0.9}
            flapDelay={0}
          />
          <Bat
            startX="0%"
            startY="0%"
            animateX={["-200px", "110vw"]}
            animateY={["70vh", "5vh"]}
            duration={2.5}
            depth={0.7}
            flapDelay={0.2}
          />
          <Bat
            startX="0%"
            startY="0%"
            animateX={["-200px", "110vw"]}
            animateY={["65vh", "15vh"]}
            duration={3.5}
            depth={0.8}
            flapDelay={0.1}
          />
        </div>
      )}

      {/* Static crow images */}
      {!isMobile && (
        <Image
          src="/assets/images/crow-1.png"
          alt=""
          width={40}
          height={40}
          className="absolute bottom-[52%] left-[13%]"
        />
      )}
      {!isMobile && (
        <Image
          src="/assets/images/crow-2.png"
          alt=""
          width={50}
          height={50}
          className="absolute bottom-[37%] right-[36%]"
        />
      )}

      {/* Static zombie images */}
      <Image
        src="/assets/images/zombie-1.png"
        alt=""
        width={40}
        height={40}
        className="absolute bottom-[48%] left-[40%]"
      />
      {!isMobile && (
        <Image
          src="/assets/images/zombie-2.png"
          alt=""
          width={140}
          height={140}
          className="absolute bottom-[25%] right-[6%]"
        />
      )}

      {/* Gravestones */}
      {GRAVESTONES.filter((stone) => !isMobile || stone.showOnMobile).map(
        (stone) => {
          const pos =
            isMobile && stone.mobilePosition != null
              ? stone.mobilePosition
              : stone.position;

          return (
            <AnimatePresence key={stone.id}>
              {!sunkenStones.has(stone.id) && (
                <motion.button
                  style={{
                    position: "absolute",
                    bottom: pos.bottom,
                    left: pos.left,
                    right: pos.right,
                  }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeIn" }}
                  onClick={() => handleGravestoneClick(stone)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleGravestoneClick(stone);
                    }
                  }}
                  aria-label={`Examine gravestone ${stone.id}`}
                  className="cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 focus-visible:rounded"
                >
                  <Image
                    src={stone.src}
                    alt={stone.alt}
                    width={stone.size.width}
                    height={stone.size.height}
                  />
                </motion.button>
              )}
            </AnimatePresence>
          );
        },
      )}

      {/* Small hand that peeks up and goes back down */}
      <AnimatePresence>
        {handVisible && (
          <motion.div
            className="absolute bottom-[32%] right-[27%] z-30"
            initial={{ y: "40%" }}
            animate={{ y: "0%" }}
            exit={{ y: "50%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src="/assets/images/zombie-hand-small-2.png"
              alt=""
              width={50}
              height={70}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <DoorTransition
        buttonText={keyCollected ? "Enter the house" : "Door is locked"}
        doorImage="/assets/images/wooden-door.png"
        positionClass="bottom-90 right-[15%] md:bottom-75 md:right-[20%]"
        sizeClass="h-40 w-24 md:h-56 md:w-30"
        isLocked={!keyCollected}
      />
      <ZombieHand
        triggerAnimation={zombieTriggered}
        onCollect={() => setKeyVisible(true)}
        onEmergeComplete={handEmeregedSound}
      />

      <KeyAppearing
        isVisible={keyVisible}
        onDone={() => {
          setKeyVisible(false);
          setKeyCollected(true);
        }}
      />
    </motion.div>
  );
}
