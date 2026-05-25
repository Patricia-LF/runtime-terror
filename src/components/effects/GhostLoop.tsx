"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useEffectSounds } from "@/hooks/useEffectSounds";

interface GhostLoopProps {
    onGhostClick: () => void;
}

export default function GhostLoop({
    onGhostClick,
}: GhostLoopProps) {
    const [show, setShow] = useState(false);
    const ghostSound = useEffectSounds({ effect: "ghost-sound" });
    const ghostVoice = useEffectSounds({ effect: "ghost-voice" });
    const [position, setPosition] = useState({ bottom: "20%", right: "15%" });

    const randomPosition = () => {
        const bottom = 10 + Math.random() * 60; //
        const right = 5 + Math.random() * 60;

        setPosition({
            bottom: `${bottom}%`,
            right: `${right}%`,
        });
    };

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const loop = () => {

            const MIN_COOLDOWN = 3000;

            const delay = MIN_COOLDOWN + (Math.random() < 0.7
                ? Math.random() * 4000
                : 4000 + Math.random() * 6000);

            timeout = setTimeout(() => {
                randomPosition();
                setShow(true);
                ghostSound();

                setTimeout(() => {
                    setShow(false);
                    loop();
                }, 4000 + Math.random() * 1000);
            }, delay);
        };

        loop();

        return () => clearTimeout(timeout);
    }, []);

    return (
        <AnimatePresence>
            {show && (
                <motion.button
                    onClick={() => {
                        onGhostClick();
                        setShow(false);
                        ghostVoice();
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, 0.18, 0.12, 0.22, 0],
                        scale: [1.02, 1, 1.01, 1],
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    className="absolute w-48 md:w-72 z-10 cursor-pointer blur-[1.5px]"
                    style={{
                        bottom: position.bottom,
                        right: position.right,
                    }}
                >
                    <img
                        src="/assets/images/ghost.png"
                        alt=""
                        className="w-full h-full pointer-events-none"
                    />
                </motion.button>
            )}
        </AnimatePresence>
    );
}