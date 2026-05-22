import { create } from "zustand";

interface FadeStore {
  isFading: boolean;
  setFading: (isFading: boolean) => void;
}

export const useFadeStore = create<FadeStore>((set) => ({
  isFading: false,
  setFading: (isFading: boolean) => set({ isFading }),
}));
