"use client";

import { useGameStore } from "@/store/useGameStore";

const handleTivoliReturn = () => {
  useGameStore.getState().resetGame();
  window.location.href = process.env.NEXT_PUBLIC_TIVOLI_URL!;
};

export function BackToTivoliButton() {
  return (
    <button
      onClick={handleTivoliReturn}
      className="z-50 text-sm text-white font-fell flex flex-col items-center cursor-pointer hover:opacity-80"
    >
      <span className="text-6xl">🎪</span>
      Back to Tivoli
    </button>
  );
}
