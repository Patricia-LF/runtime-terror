"use client";

import { useAudioStore } from "@/store/useAudioStore";

interface MuteButtonProps {
  positionClass?: string;
}

export default function MuteButton({
  positionClass = "right-4",
}: MuteButtonProps) {
  const { isMuted, setMuted } = useAudioStore();

  const toggleMute = () => {
    setMuted(!isMuted);
  };

  return (
    <button
      onClick={toggleMute}
      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
      className={`w-11 h-11 mr-8 rounded-full border border-white text-white text-xl flex items-center justify-center bg-red-dark/60 transition-opacity z-50 fixed top-4 ${positionClass}  hover:opacity-70 cursor-pointer`}
    >
      {isMuted ? "🔇" : "🔊"}
    </button>
  );
}
