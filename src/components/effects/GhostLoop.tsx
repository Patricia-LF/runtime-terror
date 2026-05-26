"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useEffectSounds } from "@/hooks/useEffectSounds";

interface GhostLoopProps {
    onGhostClick: () => void;
}

export default function GhostLoop({
    onGhostClick,
}: GhostLoopProps) {
    const spawnTimeout = useRef<NodeJS.Timeout | null>(null);
    const hideTimeout = useRef<NodeJS.Timeout | null>(null);
    const [ghostFound, setGhostFound] = useState(false);
    const [show, setShow] = useState(false);
    const ghostSound = useEffectSounds({ effect: "ghost-sound" });
    const ghostVoice = useEffectSounds({ effect: "ghost-voice" });
    const [position, setPosition] = useState({
        bottom: 100,
        right: 100,
    });

    const randomPosition = () => {
        const ghostWidth = window.innerWidth < 768 ? 190 : 290;
        const ghostHeight = window.innerWidth < 768 ? 190 : 290;

        const padding = 40;

        const maxRight =
            window.innerWidth - ghostWidth - padding;

        const maxBottom =
            window.innerHeight - ghostHeight - padding;

        const right =
            padding + Math.random() * maxRight;

        const bottom =
            padding + Math.random() * maxBottom;

        setPosition({
            bottom,
            right,
        });
    };

    useEffect(() => {
        const loop = () => {
            if (ghostFound) return;

            const MIN_COOLDOWN = 3000;

            const delay = MIN_COOLDOWN + (Math.random() < 0.7
                ? Math.random() * 4000
                : 4000 + Math.random() * 6000);

            spawnTimeout.current = setTimeout(() => {
                randomPosition();
                setShow(true);
                ghostSound();

                hideTimeout.current = setTimeout(() => {
                    setShow(false);
                    loop();
                }, 4000 + Math.random() * 1000);
            }, delay);
        };

        loop();

        return () => {
            if (spawnTimeout.current) {
                clearTimeout(spawnTimeout.current);
            }

            if (hideTimeout.current) {
                clearTimeout(hideTimeout.current);
            }
        };
    }, [ghostFound]);

    if (ghostFound) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.button
                    onClick={() => {
                        setGhostFound(true);
                        onGhostClick();
                        setShow(false);
                        ghostVoice();
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, 0.25, 0.2, 0.30, 0],
                        scale: [1.02, 1, 1.01, 1],
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    className="absolute w-48 md:w-72 z-10 cursor-pointer blur-[1.5px]"
                    style={{
                        bottom: position.bottom,
                        right: position.right,
                    }}
                    aria-label="Catch the ghost"
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