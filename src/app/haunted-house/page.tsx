"use client";

import { RoomId, useGameStore } from "@/store/useGameStore";
import Graveyard from "@/components/rooms/room1/Graveyard";
import Dolls from "@/components/rooms/room2/Dolls";
import Spiders from "@/components/rooms/room3/Spiders";
import Clown from "@/components/rooms/room4/Clown";
import { ComponentType, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFadeStore } from "@/store/useFadeStore";
import { FadeOverlay } from "@/components/shared/FadeOverlay";

const ROOMS: Record<RoomId, ComponentType> = {
  graveyard: Graveyard,
  dolls: Dolls,
  spiders: Spiders,
  clown: Clown,
};

export default function HauntedHousePage() {
  const router = useRouter();
  const currentRoom = useGameStore((s) => s.currentRoom);
  const isComplete = useGameStore((s) => s.isComplete);
  const hasExited = useGameStore((s) => s.hasExited);
  const { isFading, setFading } = useFadeStore();

  // Redirect to home if not allowed to play and to end page when game is complete or when exited
  useEffect(() => {
    // if (!mounted) return;

    // if (!isPlayingGuest && !isComplete && !hasExited) {
    //   router.push("/");
    //   return;
    // }

    if (isComplete || hasExited) {
      router.push("/haunted-house/end");
      return;
    }
  }, [isComplete, hasExited, router]);

  // Reset fade when page is mounted and ready
  useEffect(() => {
    setFading(false);
  }, [setFading]);

  // Reset if coming back from end page
  useEffect(() => {
    if (isComplete) {
      useGameStore.getState().resetGame();
    }
  }, [isComplete]);

  const CurrentRoom = ROOMS[currentRoom];
  console.log("currentRoom:", currentRoom);
  console.log("CurrentRoom:", CurrentRoom);

  // key={currentRoom} forces React to unmount and remount on room change
  return (
    <>
      <FadeOverlay isActive={isFading} />
      <div>
        <CurrentRoom key={currentRoom} />
      </div>
    </>
  );
}
