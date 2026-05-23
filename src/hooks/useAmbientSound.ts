//Hook for managing ambient sound in the game

import { useEffect } from "react";
import { useAudioStore } from "@/store/useAudioStore";
import { useGameStore } from "@/store/useGameStore";
import { ROOM_AMBIENT } from "@/lib/audio";

export function useAmbientSound(enabled = true) {
  const currentRoom = useGameStore((s) => s.currentRoom);

  useEffect(() => {
    if (!enabled) return;

    const nextAmbient = ROOM_AMBIENT[currentRoom];
    const { currentAmbient, instances, crossfade, fadeIn } = useAudioStore.getState();

    if (nextAmbient === currentAmbient) {
      const activeInstance = instances[nextAmbient];
      if (activeInstance?.id !== undefined) return;

      // Recover from stale store state where currentAmbient is set but nothing is playing.
      fadeIn(nextAmbient, 1000);
      return;
    }

    crossfade(currentAmbient, nextAmbient, 1000);
  }, [enabled, currentRoom]);

}
