"use client";

import { RoomId, useGameStore } from "@/store/useGameStore";
import Graveyard from "@/components/rooms/room1/Graveyard";
import Dolls from "@/components/rooms/room2/Dolls";
import Spiders from "@/components/rooms/room3/Spiders";
import Clown from "@/components/rooms/room4/Clown";
import { ComponentType, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [mounted, setMounted] = useState(false);

  // Reset if coming back from end page
  useEffect(() => {
    if (isComplete) {
      useGameStore.getState().resetGame();
    }
  }, []);

  // Redirect to end when game is complete
  //This should probably only be handled when clicking on the play again button on end-page
  /*   useEffect(() => {
    if (isComplete && mounted) {
      router.push("/haunted-house/end");
    }
  }, [isComplete, mounted, router]);

  useEffect(() => {
    setMounted(true);
  }, []); */

  if (!mounted) return null;

  const CurrentRoom = ROOMS[currentRoom];

  // key={currentRoom} forces React to unmount and remount on room change
  return (
    <div>
      <CurrentRoom key={currentRoom} />
    </div>
  );
}
