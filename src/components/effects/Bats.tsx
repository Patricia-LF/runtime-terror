"use client";

import { motion } from "framer-motion";
import BatSprite from "./BatSprite";

interface BatProps {
  startX: string;
  startY: string;
  animateX: string[];
  animateY: string[];
  duration: number;
  depth: number; // 0 = far away, 1 = close
  flapDelay: number;
}

export function Bat({
  startX,
  startY,
  animateX,
  animateY,
  duration,
  depth,
  flapDelay,
}: BatProps) {
  // Scale between 0.3 (far) and 1.2 (close)
  const scale = 0.3 + depth * 0.9;
  // Opacity between 0.4 (far) and 1 (close)
  const opacity = 0.4 + depth * 0.6;

  return (
    <motion.div
      style={{
        position: "absolute",
        left: startX,
        top: startY,
        opacity,
        zIndex: Math.round(depth * 20),
        transformOrigin: "top left",
      }}
      animate={{ x: animateX, y: animateY, scale }}
      transition={{
        duration,
        repeat: Infinity,
        repeatDelay: 4,
        ease: "linear",
      }}
    >
      <BatSprite flapDelay={flapDelay} />
    </motion.div>
  );
}

export default function Bats(/* { extraSwarm = false }: BatsProps */) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Starts left of screen, flies across to right */}
      <Bat
        /* src="/assets/images/bat-in-medium-size-variant-silhouette-svgrepo-com.svg" */
        startX="0%"
        startY="0%"
        animateX={["-200px", "110vw"]}
        animateY={["400px", "-200px"]}
        duration={2}
        depth={1.2}
        flapDelay={0.3}
      />

      <Bat
        /*  src="/assets/images/bat-in-medium-size-variant-silhouette-svgrepo-com.svg" */
        startX="0%"
        startY="0%"
        animateX={["-200px", "110vw"]}
        animateY={["320px", "-280px"]}
        duration={1.5}
        depth={0.3}
        flapDelay={0.2}
      />

      <Bat
        /* src="/assets/images/bat-in-medium-size-variant-silhouette-svgrepo-com.svg" */
        startX="0%"
        startY="0%"
        animateX={["-200px", "110vw"]}
        animateY={["450px", "-150px"]}
        duration={1.8}
        depth={0.5}
        flapDelay={0.1}
      />
    </div>
  );
}
