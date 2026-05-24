"use client";

import { useGameStore } from "@/store/useGameStore";
import Image from "next/image";

export function BackToTivoliButton() {
  const handleTivoliReturn = () => {
    useGameStore.getState().resetGame();
    window.parent.postMessage(
      { type: "AMUSEMENT_CLOSE" },
      "https://loopland.se",
    );
    //window.location.href = process.env.NEXT_PUBLIC_TIVOLI_URL!;
  };

  return (
    <button
      onClick={handleTivoliReturn}
      className="z-50 text-sm text-white font-fell flex flex-col items-center justify-start cursor-pointer hover:opacity-80"
    >
      <Image
        src="/assets/images/tivoli2.png"
        alt=""
        width={80}
        height={80}
        className="w-11 h-11 md:w-20 md:h-20 hover:scale-105 transition"
      />
      Back to Tivoli
    </button>
  );
}
