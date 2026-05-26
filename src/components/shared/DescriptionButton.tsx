"use client";

import { useEffect, useRef, useState } from "react";
import { RoomId } from "@/store/useGameStore";
import { ROOM_HELP } from "@/lib/rooms";

interface DescriptionButtonProps {
  currentRoom: RoomId;
}

export default function DescriptionButton({
  currentRoom,
}: DescriptionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.show();
      closeBtnRef.current?.focus();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Early return after all hooks
  const help = ROOM_HELP[currentRoom];
  if (!help) return null;

  return (
    <div className="fixed top-4 right-18 z-50">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close help" : "Room help"}
        aria-expanded={isOpen}
        className="w-11 h-11 mx-2 rounded-full border border-white text-white text-2xl align-bottom font-fell flex items-center justify-center bg-red-dark/60 hover:opacity-70 cursor-pointer"
      >
        {isOpen ? "x" : "?"}
      </button>
      <div className="relative">
        <dialog
          ref={dialogRef}
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          onClose={() => setIsOpen(false)}
          className="p-0 m-0 bg-transparent border-none w-0 h-0 overflow-visible backdrop:bg-transparent"
        >
          <div className="absolute top-2 right-[-40] w-60 bg-red-dark/80 border border-white text-white font-fell text-sm p-4 rounded flex flex-col gap-3">
            <h2 id="dialog-title" className="font-glitch text-lg">
              {help.title}
            </h2>
            <p id="dialog-description" className="font-fell text-base">
              {help.description}
            </p>
            <ul className="font-fell text-base list-disc list-inside flex flex-col gap-1">
              {help.interactions.map((interaction, i) => (
                <li key={i}>{interaction}</li>
              ))}
            </ul>
            <p className="font-fell text-base italic">Goal: {help.goal}</p>
          </div>
        </dialog>
      </div>
    </div>
  );
}
