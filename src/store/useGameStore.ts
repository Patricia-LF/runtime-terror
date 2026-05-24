//Game state store using Zustand

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAudioStore } from "@/store/useAudioStore";
import { Stamp } from "@/types";

export type RoomId = "graveyard" | "dolls" | "spiders" | "clown";

export const ROOMS: RoomId[] = ["graveyard", "dolls", "spiders", "clown"];


interface GameStore {
  //state
  currentRoom: RoomId;
  isComplete: boolean;
  stamp: Stamp;
  isPlayingGuest: boolean;
  setIsPlayingGuest: (isPlayingGuest: boolean) => void;
  hasExited: boolean;

  //actions
  goToNextRoom: () => void;
  completeGame: () => void;
  resetGame: () => void;
  setStamp: (stamp: Stamp) => void;
  setHasExited: (exited: boolean) => void;
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
      hasExited: false,
      isPlayingGuest: false,
      setIsPlayingGuest: (value: boolean) => {
        set({ isPlayingGuest: value });
      },

      goToNextRoom: () => {
        const { currentRoom } = get();
        const nextIndex = ROOMS.indexOf(currentRoom) + 1;

        if (nextIndex < ROOMS.length) {
          const nextRoom = ROOMS[nextIndex];

          useAudioStore.getState().fadeOutAllEffects(1000);

          set({ currentRoom: nextRoom });
        } else {
          set({ isComplete: true });
          set({ isPlayingGuest: false });

          
          try {
            useAudioStore.getState().fadeOutAllEffects(800);
          } catch (err) {
            // ignore
          }
        }
      },

      setHasExited: (exited) => set({ hasExited: exited }),
      completeGame: () => set({ isComplete: true }),

      resetGame: () => {
        try {
          useAudioStore.getState().unloadAll();
        } catch (err) {
          // ignore
        }

        set({
          currentRoom: "graveyard",
          isComplete: false,
          hasExited: false,
          stamp: null,
          isPlayingGuest: false,
        });
      },
    }),
    {
      name: "haunted-house-room",
    },
  ),
);
