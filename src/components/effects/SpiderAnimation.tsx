import { useState, useEffect } from "react";
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

    useEffect(() => {
        if (!isActive) {
            setFrame(0);
            return;
        }

        const interval = setInterval(() => {
            setFrame((prev) => (prev + 1) % 16);
        }, 20);

        return () => clearInterval(interval);
    }, [isActive]);

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