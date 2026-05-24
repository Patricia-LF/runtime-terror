"use client";

import { useGameStore } from "@/store/useGameStore";
import DescriptionButton from "@/components/shared/DescriptionButton";
import Image from "next/image";
import MuteButton from "../ui/MuteButton";
import { useFadeStore } from "@/store/useFadeStore";
import { useEffect, useState } from "react";
import { ExitModal } from "../ui/ExitModal";
import { usePathname } from "next/navigation";

type HauntedHouseShellProps = {
  children: React.ReactNode;
};

export default function HauntedHouseShell({
  children,
}: HauntedHouseShellProps) {
  const pathname = usePathname();
  const isEndPage = pathname === "/haunted-house/end";
  
  const currentRoom = useGameStore((s) => s.currentRoom);
  const [showExitModal, setShowExitModal] = useState(false);

  const handleExitClick = () => {
    setShowExitModal(true);
  };

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

      <MuteButton positionClass="right-14" />

      {!isEndPage && (
        <>
          <DescriptionButton currentRoom={currentRoom} />
          <button
            onClick={handleExitClick}
            aria-label="Exit haunted house"
            className="fixed z-50 bottom-4 right-4 md:bottom-8 md:right-8 rounded-4xl focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 cursor-pointer"
          >
            <Image
              src="/assets/icons/exitSVG.svg"
              alt="Exit"
              width={100}
              height={100}
              className="block"
            />
          </button>

          <ExitModal
            isOpen={showExitModal}
            onClose={() => setShowExitModal(false)}
          />
        </>
      )}
    </div>
  );
}
