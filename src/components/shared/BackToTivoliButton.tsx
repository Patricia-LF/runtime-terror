"use client";

import { useGameStore } from "@/store/useGameStore";
import Image from "next/image";
import { useState } from "react";

type BackToTivoliButtonProps = {
  revokeAccess?: boolean;
};

export function BackToTivoliButton({ revokeAccess = false }: BackToTivoliButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTivoliReturn = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (revokeAccess) {
        const response = await fetch("/api/access", {
          method: "DELETE",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to revoke access cookie");
        }

        useGameStore.getState().setIsPlayingGuest(false);
      }

      useGameStore.getState().resetGame();
      window.parent.postMessage(
        { type: "AMUSEMENT_CLOSE" },
        "https://loopland.se",
      );
    } catch (error) {
      console.error("BackToTivoliButton failed to revoke access cookie:", error);
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleTivoliReturn}
      disabled={isSubmitting}
      className="z-50 text-sm text-white font-fell flex flex-col items-center justify-start cursor-pointer hover:opacity-80"
    >
      <Image
        src="/assets/images/tivoli2.png"
        alt=""
        width={80}
        height={80}
        className="w-11 h-11 md:w-20 md:h-20 hover:scale-105 transition"
      />
      Back to Loopland
    </button>
  );
}
