//Game state store using Zustand

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAudioStore } from "@/store/useAudioStore";
import { ROOM_AMBIENT, SOUND_MAP } from "@/lib/audio";
import { SoundId } from "@/lib/audio";

export type RoomId = "graveyard" | "dolls" | "spiders" | "clown";

export const ROOMS: RoomId[] = ["graveyard", "dolls", "spiders", "clown"];

type Stamp = {
  id: number;
  image_url: string;
  stamptype: {
    animal: string;
    image_url: string;
    metal: string | null;
  };
};

interface GameStore {
  //state
  currentRoom: RoomId;
  isComplete: boolean;
  stamp: Stamp | null;
  setStamp: (stamp: Stamp) => void;

  //actions
  goToNextRoom: () => void;
  completeGame: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>()(
  // Persist middleware saves the game state to localStorage, allowing the player to continue from the same room even after a page reload or when returning to the site later.
  persist(
    (set, get) => ({
      // Start values
      currentRoom: "graveyard",
      isComplete: false,
      stamp: null,
      setStamp: (stamp) => set({ stamp }),

      // Functions that uppdates state
      goToNextRoom: () => {
        const { currentRoom } = get();
        const nextIndex = ROOMS.indexOf(currentRoom) + 1;

        if (nextIndex < ROOMS.length) {
          const nextRoom = ROOMS[nextIndex];
          const nextAmbient = ROOM_AMBIENT[nextRoom];

          // Fade out all sounds except the next room's ambient
          const { instances } = useAudioStore.getState();
          const currentAmbient = useAudioStore.getState().currentAmbient;

          Object.entries(instances).forEach(([soundId, instance]) => {
            // Skip current and next ambient — handled by crossfade
            if (soundId === currentAmbient || soundId === nextAmbient) return;
            if (instance?.id !== undefined) {
              const config = SOUND_MAP[soundId as SoundId];
              const targetVolume = config.volume ?? 1;
              instance.howl.fade(targetVolume, 0, 1000, instance.id);
              instance.howl.once("fade", () => instance.howl.stop());
            }
          });

          set({ currentRoom: nextRoom });
        } else {
          set({ isComplete: true });
          // Fade out and unload all audio when the game completes to free resources
          const currentAmbient = useAudioStore.getState().currentAmbient;
          if (currentAmbient) {
            useAudioStore.getState().fadeOut(currentAmbient, 2000);
          }
          // ensure all Howl instances are unloaded after a short delay
          setTimeout(() => {
            try {
              useAudioStore.getState().unloadAll();
            } catch (err) {
              // ignore
            }
          }, 2200);
        }
      },

      completeGame: () => set({ isComplete: true }),

      resetGame: () => {
        // unload all audio resources when resetting
        try {
          useAudioStore.getState().unloadAll();
        } catch (err) {
          // ignore
        }
        set({
          currentRoom: "graveyard",
          isComplete: false,
          stamp: null,
        });
      },
    }),
    {
      name: "haunted-house-room",
    },
  ),
);
