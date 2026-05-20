"use client";
import Fog from "@/components/effects/Fog";
import DoorTransition from "@/components/shared/DoorTransition";
import ZombieHand from "@/components/rooms/room1/ZombieHand";
import { useState } from "react";
import { useEffectSounds } from "@/hooks/useEffectSounds";

export default function Graveyard() {
  const [doorOpen, setDoorOpen] = useState(false);

  const keyCollectedSound = useEffectSounds({ effect: "key-appearing" });
  const handEmeregedSound = useEffectSounds({ effect: "danger" });

  function handleDoorOpen() {
    keyCollectedSound();
    setDoorOpen(true);
  }

  return (
    <div className="absolute inset-0 bg-[url('/assets/images/graveyard-night.png')] bg-cover bg-position-[center_left_-250px] md:bg-center">
      {/* <DoorButton buttonText="Enter the house" /> */}
      <Fog 
        opacity={0.6}
      />
      <DoorTransition
        buttonText="Enter the house"
        doorImage="/assets/images/wooden-door.png"
        positionClass="bottom-90 right-[15%] md:bottom-75 md:right-[20%]"
        sizeClass="h-40 w-24 md:h-56 md:w-30"
      />
      <ZombieHand 
      triggerOnMount={true}
      onCollect={handleDoorOpen}
      onEmergeComplete={() => handEmeregedSound()}
      />
    </div>
  );
}
