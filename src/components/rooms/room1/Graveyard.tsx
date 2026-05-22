"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Fog from "@/components/effects/Fog";
import Bats from "@/components/effects/Bats";
import DoorTransition from "@/components/shared/DoorTransition";
import ZombieHand from "@/components/rooms/room1/ZombieHand";
import { useEffectSounds } from "@/hooks/useEffectSounds";
import KeyAppearing from "@/components/shared/KeyAppearing";

type GravestoneEffect = "correct" | "bats" | "shake" | "hand" | "sink";

interface Gravestone {
  id: number;
  src: string;
  alt: string;
  effect: GravestoneEffect;
  // Position as percentage — bottom half of screen
  position: {
    bottom: string;
    left?: string;
    right?: string;
  };
  size: {
    width: number;
    height: number;
  };
}

const GRAVESTONES: Gravestone[] = [
  {
    id: 1,
    src: "/assets/images/gravestone1.png", // Silhouette — smaller, further away
    alt: "",
    effect: "hand",
    position: { bottom: "35%", left: "42%" },
    size: { width: 60, height: 80 },
  },
  {
    id: 2,
    src: "/assets/images/gravestone3.png",
    alt: "",
    effect: "shake",
    position: { bottom: "15%", left: "48%" },
    size: { width: 100, height: 140 },
  },
  {
    id: 3,
    src: "/assets/images/gravestone4.png",
    alt: "",
    effect: "correct",
    position: { bottom: "24%", left: "28%" },
    size: { width: 100, height: 120 },
  },
  {
    id: 4,
    src: "/assets/images/gravestone2.png",
    alt: "",
    effect: "bats",
    position: { bottom: "28%", right: "25%" },
    size: { width: 90, height: 120 },
  },
  {
    id: 5,
    src: "/assets/images/gravestone1.png", // Reused
    alt: "",
    effect: "sink",
    position: { bottom: "38%", right: "40%" },
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
  const [doorOpen, setDoorOpen] = useState(false);

  const handEmeregedSound = useEffectSounds({ effect: "danger" });
  const creakSound = useEffectSounds({ effect: "creaking-gate" });

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
      case "hand":
        handEmeregedSound();
        setHandVisible(true);
        setTimeout(() => setHandVisible(false), 2000);
        break;
      case "sink":
        creakSound();
        break;
    }
  };

  function handleDoorOpen() {
    setDoorOpen(true);
  }

  return (
    <motion.div
      className="absolute inset-0 bg-[url('/assets/images/graveyard-night.png')] bg-cover bg-position-[center_left_-250px] md:bg-center"
      animate={shaking ? { x: [-5, 5, -5, 5, -3, 3, 0] } : { x: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <Fog opacity={0.6} />

      {/* Static crow images */}
      <Image
        src="/assets/images/crow-1.png"
        alt=""
        width={40}
        height={40}
        className="absolute bottom-[52%] left-[13%]"
      />
      <Image
        src="/assets/images/crow-2.png"
        alt=""
        width={50}
        height={50}
        className="absolute bottom-[37%] right-[36%]"
      />

      {/* Static zombie images */}
      <Image
        src="/assets/images/zombie-1.png"
        alt=""
        width={40}
        height={40}
        className="absolute bottom-[48%] left-[40%]"
      />
      <Image
        src="/assets/images/zombie-2.png"
        alt=""
        width={140}
        height={140}
        className="absolute bottom-[25%] right-[6%]"
      />

      {/* Gravestones */}
      {GRAVESTONES.map((stone) => (
        <AnimatePresence key={stone.id}>
          {!sunkenStones.has(stone.id) && (
            <motion.button
              style={{
                position: "absolute",
                bottom: stone.position.bottom,
                left: stone.position.left,
                right: stone.position.right,
              }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeIn" }}
              onClick={() => handleGravestoneClick(stone)}
              aria-label="Examine gravestone"
              className="cursor-pointer"
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
      ))}

      {/* Small hand that peeks up and goes back down */}
      <AnimatePresence>
        {handVisible && (
          <motion.div
            className="absolute bottom-[35%] left-[42%] z-30"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Image
              src="/assets/images/zombie-hand-small-2.png"
              alt=""
              width={60}
              height={80}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <DoorTransition
        buttonText={doorOpen ? "Enter the house" : "Door is locked"}
        doorImage="/assets/images/wooden-door.png"
        positionClass="bottom-90 right-[15%] md:bottom-75 md:right-[20%]"
        sizeClass="h-40 w-24 md:h-56 md:w-30"
        /* isLocked={!keyCollected} */
      />
      <ZombieHand
        /* triggerOnMount={false} */
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
