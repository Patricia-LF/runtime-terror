"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";
import { useState, useEffect } from "react";
import { useEffectSounds } from "@/hooks/useEffectSounds";

interface SpiderDropProps {
  allWebsRemoved: boolean;
}

export default function SpiderDrop({ allWebsRemoved }: SpiderDropProps) {
  const dropDelay = useMemo(() => Math.random() * 3 + 1, []);
  const spiderDrop = useEffectSounds({ effect: "spider-drop" });

  useEffect(() => {
    if (!allWebsRemoved) return;
    // Wait for dropDelay before playing sound
    const timer = setTimeout(() => {
      spiderDrop();
    }, dropDelay * 1000);
    return () => clearTimeout(timer);
  }, [allWebsRemoved]);

  const [landingY, setLandingY] = useState("-5vh"); // Mobile default
  useEffect(() => {
    const update = () => {
      setLandingY(window.innerWidth >= 768 ? "-40vh" : "-5vh");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <AnimatePresence>
      {allWebsRemoved && (
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-50"
          style={{ transformOrigin: "top center" }}
          initial={{ y: "-1000%", rotate: 0 }}
          animate={{
            y: ["-1000%", landingY],
            rotate: [0.5, -1.5, 1.5, -1, 1, -0.5, 0.5, 0],
          }}
          transition={{
            y: {
              duration: 0.4,
              ease: "easeIn",
              delay: dropDelay,
            },
            rotate: {
              duration: 12,
              ease: "easeInOut",
              delay: dropDelay + 0.4,
              times: [0, 0.15, 0.35, 0.5, 0.65, 0.8, 0.9, 1],
            },
          }}
        >
          <Image
            src="/assets/images/spider2.png"
            alt=""
            width={300}
            height={300}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
