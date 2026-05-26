import { useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import styles from "./SpiderAnimation.module.css";

type SpiderAnimationProps = {
    isActive?: boolean;
    reverse?: boolean;
    style?: CSSProperties;
};

export default function SpiderAnimation({ isActive = true, style }: SpiderAnimationProps) {
    const [frame, setFrame] = useState(0);
    const [finished, setFinished] = useState(false);

    /* 4x4 sprite sheet animation (1024x1024), each frame is 256x256. We cycle through 16 frames and shift background-position to display the correct frame. */
    const frameSize = 256;
    const cols = 4;

    // Start sprite-frame animation only after the CSS delay so the spider stays idle
    // until the movement animation begins.
    const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const parseTimeToMs = (val?: string) => {
        if (!val) return 0;
        if (val.endsWith("ms")) return Number(val.replace("ms", ""));
        if (val.endsWith("s")) return Number(val.replace("s", "")) * 1000;
        const n = Number(val);
        return Number.isNaN(n) ? 0 : n;
    };

    useEffect(() => {
        // clear previous timers
        if (animTimeoutRef.current) {
            clearTimeout(animTimeoutRef.current as any);
            animTimeoutRef.current = null;
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current as any);
            intervalRef.current = null;
        }

        if (!isActive) {
            setFrame(0);
            return;
        }

        const delayVal = (style && (style as any)["--spider-delay"]) as string | undefined;
        const delayMs = parseTimeToMs(delayVal || "0s");

        animTimeoutRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                setFrame((prev) => (prev + 1) % 16);
            }, 20);
        }, delayMs);

        return () => {
            if (animTimeoutRef.current) {
                clearTimeout(animTimeoutRef.current as any);
                animTimeoutRef.current = null;
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current as any);
                intervalRef.current = null;
            }
        };
    }, [isActive, style]);

    if (finished) return null;

    const x = (frame % cols) * frameSize;
    const y = Math.floor(frame / cols) * frameSize;

    const baseScale = {
        ["--spider-scale" as string]: (style && (style as any)["--spider-scale"]) || "0.6",
    } as CSSProperties;

    // Always apply parent `style` (so `top`/`left` control idle position), and add scale vars.
    const wrapperStyle: CSSProperties = { ...(style || {}), ...baseScale };

    const className = `${styles.spiderWrap} ${isActive ? styles.moving : styles.idle}`;

    const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
        if (e.animationName === "scurry") {
            setFinished(true);
        }
    };

    return (
        <div className={className} style={wrapperStyle} onAnimationEnd={handleAnimationEnd}>
            <div className={styles.spiderScale}>
                <div
                    className={styles.spider}
                    style={{
                        backgroundPosition: `-${x}px -${y}px`,
                    }}
                />
                <div
                    className={styles.spiderShadow}
                    style={{
                        backgroundPosition: `-${x}px -${y}px`,
                    }}
                />
            </div>
        </div>
    );
}