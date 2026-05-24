"use client";

import { useEffect } from "react";
import { Howler } from "howler";

export function useAudioUnlock() {
  useEffect(() => {
    const unlockAudio = async () => {
      try {
        if (Howler.ctx && Howler.ctx.state !== "running") {
          await Howler.ctx.resume();
        }
      } catch {
        // ignore unlock failures; user interaction may retry naturally
      }
    };

    const options = { once: true, passive: true } as const;
    window.addEventListener("pointerdown", unlockAudio, options);
    window.addEventListener("keydown", unlockAudio, options);

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);
}