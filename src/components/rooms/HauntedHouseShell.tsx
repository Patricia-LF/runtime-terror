"use client";

import { useAmbientSound } from "@/hooks/useAmbientSound";
import { useGameStore } from "@/store/useGameStore";
import DescriptionButton from "@/components/shared/DescriptionButton";
import Image from "next/image";
import Link from "next/link";
import MuteButton from "../ui/MuteButton";
import { useFadeStore } from "@/store/useFadeStore";
import { useEffect } from "react";

type HauntedHouseShellProps = {
  children: React.ReactNode;
};

export default function HauntedHouseShell({
  children,
}: HauntedHouseShellProps) {
  useAmbientSound();
  const currentRoom = useGameStore((s) => s.currentRoom);

  const { setFading } = useFadeStore();

  useEffect(() => {
    setFading(true);

    const t = setTimeout(() => {
      setFading(false);
    }, 50);

    return () => clearTimeout(t);
  }, [currentRoom]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden position-relative">
      {children}

      <DescriptionButton currentRoom={currentRoom} />
      <MuteButton positionClass="right-14" />

      <Link
        href="/haunted-house/end"
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
