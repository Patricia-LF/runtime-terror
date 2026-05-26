import { create } from "zustand";
import { Howl, Howler } from "howler";
import { SoundId, SOUND_MAP } from "@/lib/audio";

type HowlInstance = {
  id?: number;
  howl: Howl;
};

//Defining the shape of our audio store
type AudioStore = {
  instances: Partial<Record<SoundId, HowlInstance>>;
  currentAmbient: SoundId | null;
  isMuted: boolean;
  masterVolume: number;

  load: (soundId: SoundId) => void;
  play: (soundId: SoundId) => void;
  stop: (soundId: SoundId) => void;
  fadeIn: (soundId: SoundId, duration?: number) => void;
  fadeOut: (soundId: SoundId, duration?: number) => void;
  unload: (soundId: SoundId) => void;
  unloadAll: () => void;
  fadeOutAllEffects: (duration?: number) => void;
  stopAmbient: (duration?: number) => void;
  syncAmbient: (nextAmbient: SoundId | null, duration?: number) => void;
  crossfade: (from: SoundId | null, to: SoundId, duration?: number) => void;
  setMuted: (muted: boolean) => void;
  setMasterVolume: (volume: number) => void;
};

export const useAudioStore = create<AudioStore>((set, get) => ({
  instances: {},
  currentAmbient: null,
  isMuted: false,
  masterVolume: 1,

  load: (soundId) => {
    const { instances } = get();
    if (instances[soundId]) return; // already loaded

    const config = SOUND_MAP[soundId];
    const howl = new Howl({
      src: config.src,
      loop: config.loop ?? false,
      volume: config.volume ?? 1,
      preload: true,
    });

    set((state) => ({
      instances: { ...state.instances, [soundId]: { howl } },
    }));
  },

  play: (soundId) => {
    const { instances, load } = get();
    if (!instances[soundId]) load(soundId);

    const instance = get().instances[soundId];
    if (!instance) return;

    const id = instance.howl.play();
    set((state) => ({
      instances: { ...state.instances, [soundId]: { ...instance, id } },
    }));
  },

  stop: (soundId) => {
    const { instances } = get();
    instances[soundId]?.howl.stop();
  },

  fadeIn: (soundId, duration = 1000) => {
    const { instances, load } = get();
    if (!instances[soundId]) load(soundId);

    const instance = get().instances[soundId];
    if (!instance) return;

    instance.howl.volume(0);
    const id = instance.howl.play();
    const targetVolume = SOUND_MAP[soundId].volume ?? 1;
    instance.howl.fade(0, targetVolume, duration, id);

    set((state) => ({
      instances: { ...state.instances, [soundId]: { ...instance, id } },
    }));
  },

  fadeOut: (soundId, duration = 1000) => {
    const { instances } = get();

    const instance = instances[soundId];

    if (!instance || instance.id === undefined) return;

    const soundIdInstance = instance.id;

    const targetVolume = SOUND_MAP[soundId].volume ?? 1;
    instance.howl.fade(targetVolume, 0, duration, soundIdInstance);

    // When fade finishes, stop and unload the Howl instance and remove it from the store.
    try {
      instance.howl.once("fade", () => {
        try {
          instance.howl.stop(soundIdInstance);
          instance.howl.unload();
        } catch (err) {
          // ignore unload errors
        }
        set((state) => {
          const copy = { ...state.instances };
          delete copy[soundId];
          return { instances: copy };
        });
      });
    } catch (err) {
      // Fallback: if once/fade isn't available, schedule cleanup.
      setTimeout(() => {
        try {
          instance.howl.stop(soundIdInstance);
          instance.howl.unload();
        } catch (err) {
          // ignore unload errors
        }
        set((state) => {
          const copy = { ...state.instances };
          delete copy[soundId];
          return { instances: copy };
        });
      }, duration);
    }
  },

  unload: (soundId) => {
    const { instances } = get();
    const instance = instances[soundId];
    if (!instance) return;
    try {
      instance.howl.stop();
      instance.howl.unload();
    } catch (err) {
      // ignore
    }
    set((state) => {
      const copy = { ...state.instances };
      delete copy[soundId];
      return { instances: copy };
    });
  },

  unloadAll: () => {
    const { instances } = get();
    Object.keys(instances).forEach((sid) => {
      const inst = instances[sid as SoundId];
      if (inst) {
        try {
          inst.howl.stop();
          inst.howl.unload();
        } catch (err) {
          // ignore
        }
      }
    });
    set({ instances: {}, currentAmbient: null });
  },

  fadeOutAllEffects: (duration = 1000) => {
    const { instances, currentAmbient } = get();
    Object.entries(instances).forEach(([soundId, instance]) => {
      const config = SOUND_MAP[soundId as SoundId];
      // Skip current room ambient — handled by crossfade
      if (soundId === currentAmbient) return;
      if (instance?.id !== undefined) {
        const targetVolume = config.volume ?? 1;
        instance.howl.fade(targetVolume, 0, duration, instance.id);
        instance.howl.once("fade", () => instance.howl.stop());
      }
    });
  },

  stopAmbient: (duration = 1000) => {
    const { currentAmbient, instances, fadeOut, stop } = get();

    if (!currentAmbient) return;

    const activeAmbient = instances[currentAmbient];
    if (activeAmbient?.id !== undefined) {
      fadeOut(currentAmbient, duration);
    } else {
      stop(currentAmbient);
    }

    set({ currentAmbient: null });
  },

  syncAmbient: (nextAmbient, duration = 1000) => {
    const { currentAmbient, instances, fadeIn, fadeOut, stop } = get();

    if (nextAmbient === currentAmbient) {
      if (!nextAmbient) return;

      const activeAmbient = instances[nextAmbient];
      if (activeAmbient?.id === undefined) {
        fadeIn(nextAmbient, duration);
        set({ currentAmbient: nextAmbient });
      }

      return;
    }

    if (currentAmbient) {
      const activeAmbient = instances[currentAmbient];
      if (activeAmbient?.id !== undefined) {
        fadeOut(currentAmbient, duration);
      } else {
        stop(currentAmbient);
      }
    }

    if (nextAmbient) {
      fadeIn(nextAmbient, duration);
      set({ currentAmbient: nextAmbient });
      return;
    }

    set({ currentAmbient: null });
  },

  crossfade: (from, to, duration = 1000) => {
    const { fadeOut, fadeIn } = get();
    if (from) fadeOut(from, duration);
    fadeIn(to, duration);
    set({ currentAmbient: to });
  },

  setMuted: (muted) => {
    Howler.mute(muted);
    set({ isMuted: muted });
  },

  setMasterVolume: (volume) => {
    Howler.volume(volume);
    set({ masterVolume: volume });
  },
}));
