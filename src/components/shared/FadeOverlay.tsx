"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

interface FadeOverlayProps {
    isActive: boolean;
    duration?: number;
}

export function FadeOverlay({ isActive, duration = 0.8 }: FadeOverlayProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <motion.div
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration, ease: "easeInOut" }}
            className="fixed inset-0 bg-black pointer-events-none"
            style={{ zIndex: 9999 }}
        />,
        document.body,
    );
}