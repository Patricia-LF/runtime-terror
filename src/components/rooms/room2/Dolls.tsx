import RockingChair from "@/components/effects/RockingChair";
import DoorTransition from "@/components/shared/DoorTransition";
import { useEffect, useState } from "react";
import { useAudioStore } from "@/store/useAudioStore";
import { useGameStore } from "@/store/useGameStore";
import KeyAppearing from "@/components/shared/KeyAppearing";

export default function Dolls() {
  const { play, stop } = useAudioStore();
  const currentRoom = useGameStore((s) => s.currentRoom);
  const [keyVisible, setKeyVisible] = useState(false);
  const [keyCollected, setKeyCollected] = useState(false);

  useEffect(() => {
    if (currentRoom !== "dolls") {
      useAudioStore.getState().instances["doll-laugh"]?.howl.stop();
      return;
    }

    let interval: ReturnType<typeof setInterval> | null = null;

    const initialDelay = setTimeout(() => {
      interval = setInterval(() => {
        const shouldPlay = Math.random() < 0.4;
        if (shouldPlay) play("doll-laugh");
      }, 15000);
    }, 10000);

    // Cleanup — runs when currentRoom changes or component unmounts
    return () => {
      clearTimeout(initialDelay);
      if (interval) clearInterval(interval);
      useAudioStore.getState().instances["doll-laugh"]?.howl.stop();
    };
  }, [currentRoom, play]);

  return (
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat
      bg-[url('/assets/images/dolls-bg.jpg')]"
    >
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <RockingChair onJumpscareComplete={() => setKeyVisible(true)} />

      <KeyAppearing
        isVisible={keyVisible}
        onDone={() => {
          setKeyVisible(false);
          setKeyCollected(true);
        }}
      />

      {/* Cellar door to spider room */}
      <DoorTransition
        buttonText={keyCollected ? "Go further" : "Door is locked"}
        doorImage="/assets/images/cellar-door.png"
        isLocked={!keyCollected}
        positionClass="bottom-42 right-[10%] md:bottom-32 md:right-[45%]"
        sizeClass="h-60 w-34 md:h-66 md:w-40"
      />
    </div>
  );
}
