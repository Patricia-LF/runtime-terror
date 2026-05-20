//Hook for managing ambient sound in the game

import { useEffect } from "react";
import { useAudioStore } from "@/store/useAudioStore";
import { useGameStore } from "@/store/useGameStore";
import { ROOM_AMBIENT } from "@/lib/audio";

export function useAmbientSound() {
  const currentRoom = useGameStore((s) => s.currentRoom);
  const { currentAmbient, crossfade } = useAudioStore();

  useEffect(() => {
    const nextAmbient = ROOM_AMBIENT[currentRoom];
    if (nextAmbient === currentAmbient) return;
    crossfade(currentAmbient, nextAmbient, 2000);
  }, [currentRoom, currentAmbient, crossfade]);
}
