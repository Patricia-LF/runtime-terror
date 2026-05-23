"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SoundId } from "@/lib/audio";
import { useAudioStore } from "@/store/useAudioStore";

const AMBIENT_SOUNDS: Record<string, SoundId> = {
    "/": "start-screen-ambience",
    "/haunted-house/end": "end-screen-ambience",
};


export function useRouteAmbientSound() {
    const currentRoute = usePathname();

    useEffect(() => {
        const desiredAmbient = AMBIENT_SOUNDS[currentRoute] || null;
        const { currentAmbient, fadeIn, fadeOut, crossfade } = useAudioStore.getState();

        if (currentRoute?.startsWith("/haunted-house") && currentRoute !== "/haunted-house/end") return;

        if (desiredAmbient === currentAmbient) return;

        if (desiredAmbient === null) {
            if (currentAmbient) {
                fadeOut(currentAmbient, 1000);
                useAudioStore.setState({ currentAmbient: null });
            }
            return;
        }

        if (!currentAmbient) {
            fadeIn(desiredAmbient, 1000);
            useAudioStore.setState({ currentAmbient: desiredAmbient });
        } else {
            crossfade(currentAmbient, desiredAmbient, 1000);
        }
    }, [currentRoute]);

}
            

