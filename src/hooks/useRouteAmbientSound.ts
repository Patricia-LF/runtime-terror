"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SoundId } from "@/lib/audio";
import { useAudioStore } from "@/store/useAudioStore";

const AMBIENT_SOUNDS: Record<string, SoundId> = {
    "/": "start-screen-ambience",
    "/haunted-house/end": "end-screen-ambience",
};

function playAmbient(soundId: SoundId) {
    const audioStore = useAudioStore.getState();
    if (audioStore.currentAmbient === soundId) return;
    audioStore.crossfade(audioStore.currentAmbient, soundId, 1000);
}



export function useRouteAmbientSound() {
    const currentRoute = usePathname();


    useEffect(() => {
        if (AMBIENT_SOUNDS[currentRoute]) {
            playAmbient(AMBIENT_SOUNDS[currentRoute]);
        }
    }, [currentRoute]);
}