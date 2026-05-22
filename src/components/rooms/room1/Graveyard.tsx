"use client";
import Fog from "@/components/effects/Fog";
import DoorTransition from "@/components/shared/DoorTransition";
import ZombieHand from "@/components/rooms/room1/ZombieHand";
import { useState } from "react";
import { useEffectSounds } from "@/hooks/useEffectSounds";
import KeyAppearing from "@/components/shared/KeyAppearing";

export default function Graveyard() {

  const [keyVisible, setKeyVisible] = useState(false);
  const [keyCollected, setKeyCollected] = useState(false);

  const handEmeregedSound = useEffectSounds({ effect: "danger" });

  return (
    <div className="absolute inset-0 bg-[url('/assets/images/graveyard-night.png')] bg-cover bg-position-[center_left_-250px] md:bg-center">
      <Fog opacity={0.6} />
      <DoorTransition
        buttonText={keyCollected ? "Enter the house" : "Door is locked"}
        doorImage="/assets/images/wooden-door.png"
        positionClass="bottom-90 right-[15%] md:bottom-75 md:right-[20%]"
        sizeClass="h-40 w-24 md:h-56 md:w-30"
        isLocked={!keyCollected}
      />
      <ZombieHand
        triggerOnMount={true}
        onCollect={() => setKeyVisible(true)}
        onEmergeComplete={handEmeregedSound}
      />
      <KeyAppearing
        isVisible={keyVisible}
        onDone={() => {
          setKeyVisible(false);
          setKeyCollected(true);
        }}
      />
    </div>
  );
}
