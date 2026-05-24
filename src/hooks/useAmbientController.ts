"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ROOM_AMBIENT, SoundId } from "@/lib/audio";
import { useAudioStore } from "@/store/useAudioStore";
import { useGameStore } from "@/store/useGameStore";

// Centralized hook to control ambient sounds based on route and game state

export function useAmbientController() {
  const pathname = usePathname();
  const currentRoom = useGameStore((s) => s.currentRoom);

  useEffect(() => {
    const { syncAmbient, stopAmbient } = useAudioStore.getState();

    if (pathname === "/") {
      syncAmbient("start-screen-ambience", 1000);
      return;
    }

    if (pathname === "/haunted-house/end") {
      syncAmbient("end-screen-ambience", 1000);
      return;
    }

    if (pathname.startsWith("/haunted-house") && pathname !== "/haunted-house/end") {
      stopAmbient(600);
      return;
    }
    stopAmbient(1000);
  }, [pathname]);

  useEffect(() => {
    const { syncAmbient } = useAudioStore.getState();

    if (!pathname.startsWith("/haunted-house") || pathname === "/haunted-house/end") {
      return;
    }

    const desiredAmbient: SoundId | null = ROOM_AMBIENT[currentRoom] ?? null;
    if (desiredAmbient) {
      syncAmbient(desiredAmbient, 1000);
    }
  }, [currentRoom, pathname]);
}