"use client";

import { motion } from "framer-motion";

interface FogProps {
  opacity?: number;
}

export default function Fog({ opacity = 1 }: FogProps) {
  return (
    <div
      className="absolute inset-0 bottom-0 overflow-hidden pointer-events-none z-30 md:-bottom-40"
      style={{ opacity: opacity }}
    >
      {/* Slow diagonal drift from bottom left */}
      <motion.img
        src="/assets/images/cloud2.png"
        alt=""
        className="absolute bottom-10 left-0 w-[140%] opacity-20 md:bottom-0"
        animate={{ x: ["-80%", "30%", "-80%"], y: ["5%", "0%", "5%"] }}
        transition={{ duration: 88, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Drifts in from right, rises slightly */}
      <motion.img
        src="/assets/images/cloud6.png"
        alt=""
        className="absolute bottom-0 right-0 w-full opacity-20"
        animate={{ x: ["20%", "-70%", "20%"], y: ["0%", "-8%", "0%"] }}
        transition={{ duration: 92, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Mid layer, opposite diagonal */}
      <motion.img
        src="/assets/images/cloud1.png"
        alt=""
        className="absolute bottom-0 left-0 w-3/4 opacity-30"
        animate={{ x: ["-50%", "15%", "-40%"], y: ["0%", "6%", "0%"] }}
        transition={{ duration: 100, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Top layer drifts in from right */}
      <motion.img
        src="/assets/images/cloud5.png"
        alt=""
        className="absolute bottom-20 right-0 w-2/3 opacity-20 md:bottom-0"
        animate={{ x: ["15%", "-55%", "15%"], y: ["-4%", "4%", "-4%"] }}
        transition={{ duration: 105, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Extra layer */}
      <motion.img
        src="/assets/images/cloud4.png"
        alt=""
        className="absolute bottom-0 left-0 w-[140%] opacity-20"
        animate={{ x: ["-60%", "30%", "-60%"], y: ["6%", "-5%", "6%"] }}
        transition={{ duration: 98, repeat: Infinity, ease: "easeInOut" }}
      />{" "}
    </div>
  );
}
