"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import Image from "next/image";

type ZombieHandProps = {
  triggerOnMount: boolean;
  onEmergeComplete?: () => void;
  onCollect?: () => void;
};

const handVariants: Variants = {
  hidden: {
    y: 300,
    rotate: -8,
    opacity: 0,
  },
  emerge: {
    y: [160, 140, 90, 60, 50, 40, 12],
    rotate: [-8, -8, -12, -6, -6, -2, +2],
    opacity: [0, 1, 1, 1, 1, 1, 1],
    transition: {
      duration: 4.2,
      ease: "easeInOut",
      times: [0, 0.3, 0.45, 0.7, 0.85, 0.9, 1],
    },
  },
  retract: {
    y:[12, 40, 60, 90, 140, 160, 300],
    rotate: [+2, -2, -6, -6, -12, -8, -8],
    opacity: [1, 1, 1, 1, 1, 1, 0],
    transition: {
      duration: 4.2,
      ease: "easeInOut",
        times: [0, 0.1, 0.3, 0.45, 0.7, 0.85, 1],
    },
  }
};

export default function ZombieHand({ 
    triggerOnMount = false, 
    onEmergeComplete, 
    onCollect }: ZombieHandProps) {

        const controls = useAnimation();
        const hasTriggered = useRef(false);
        const [collected, setCollected] = useState<boolean>(false);
        const emergedOnce = useRef(false);

        const startAnimation = async () => {
            if (hasTriggered.current) return;

            hasTriggered.current = true;
            await controls.start("emerge");

            if (!emergedOnce.current) {
                onEmergeComplete?.();
                emergedOnce.current = true;
            }
        };

        useEffect(() => {
            if (!triggerOnMount) return;

            const timeout = setTimeout(startAnimation, 1200);
            return () => clearTimeout(timeout);
        }, [triggerOnMount, startAnimation]);

        const collectKeyHandler = async () => {
            setCollected(true);
            await controls.start("retract");
            hasTriggered.current = false;
            onCollect?.();
        }
            

        return (
            <div className="absolute top-[52%] left-[14%] z-10 w-32.5 h-32.5 overflow-hidden pointer-events-none md:left-[25%] md:top-[50%] md:w-40 md:h-40">
            <motion.div
                initial="hidden"
                animate={controls}
                variants={handVariants}
                aria-hidden="true"
            >
                <button
                onClick={collectKeyHandler}
                role="button"
                className=" w-full h-full cursor-pointer pointer-events-auto"
                aria-label={collected ? "Zombie Hand" : "Key on Zombie Hand"}
                >
                    <Image
                    src={collected ? "/assets/images/zombie-hand.png" : "/assets/images/zombie-hand-key.png"}
                    alt={collected ? "Zombie Hand" : "Key on Zombie Hand"}
                    width={130}
                    height={130}
                    draggable={false}
                    className="h-full w-full object-contain skew-1 md:w-40 md:h-40"
                    />
                </button>
            </motion.div>
            </div>
        );
}