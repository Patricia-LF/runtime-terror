"use client";

import { useAmbientSound } from "@/hooks/useAmbientSound";
import { useGameStore } from "@/store/useGameStore";
import DescriptionButton from "@/components/shared/DescriptionButton";
import Image from "next/image";
import Link from "next/link";
import MuteButton from "../ui/MuteButton";
import { use, useEffect } from "react";
import { useAudioStore } from "@/store/useAudioStore";

type HauntedHouseShellProps = {
  children: React.ReactNode;
};

export default function HauntedHouseShell({
  children,
}: HauntedHouseShellProps) {
  useAmbientSound();
  const currentRoom = useGameStore((s) => s.currentRoom);

  // Stop ambient sound when exiting the haunted house (unmounting this component)
  useEffect(() => {
    return () => {
      const { currentAmbient, stop } = useAudioStore.getState();
      if (currentAmbient) {

        const ambient = useAudioStore.getState().instances[currentAmbient];
        if (ambient && ambient.id !== undefined) {

          const id = ambient.id;

          ambient.howl.fade(1, 0, 600, id);
          ambient.howl.once('fade', () => ambient.howl.stop(id));

        } else {

          stop(currentAmbient);

        }

        useAudioStore.setState({ currentAmbient: null });
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden position-relative">
      {children}

      <DescriptionButton currentRoom={currentRoom} />
      <MuteButton positionClass="right-14" />

      <Link
        href="/"
        aria-label="Exit haunted house"
        className="fixed z-50 bottom-4 right-4 md:bottom-8 md:right-8 rounded-4xl focus-visible:outline-2 focus-visible:outline-red-500 focus-visible:outline-offset-4"
      >
        <Image
          src="/assets/icons/exitSVG.svg"
          alt="Exit"
          width={100}
          height={100}
          className="block"
        />
      </Link>
    </div>
  );
}
