import { useAudioStore } from "@/store/useAudioStore";
import { EffectSoundId } from "@/lib/audio";
import { useCallback } from "react";

type Props = {
  effect: EffectSoundId
}

export function useEffectSounds({ effect }: Props) {
    const play = useAudioStore((state) => state.play)

    return useCallback(() => {play(effect)}, [effect, play])
}
