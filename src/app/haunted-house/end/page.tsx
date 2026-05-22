"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TIVOLI_MODE } from "@/lib/gameConfig";
import { useGameStore } from "@/store/useGameStore";
import Image from "next/image";
import Fog from "@/components/effects/Fog";
import { LinkButton } from "@/components/shared/LinkButton";
import { BackToTivoliButton } from "@/components/shared/BackToTivoliButton";

export default function EndPage() {
  const router = useRouter();
  const [isRevoking, setIsRevoking] = useState(false);
  const [revokeError, setRevokeError] = useState<string | null>(null);
  const [showStamp, setShowStamp] = useState(false);

  const stamp = useGameStore((s) => s.stamp);
  const hasExited = useGameStore((s) => s.hasExited);

  // Show stamp automatically after 6 seconds
  useEffect(() => {
    if (!TIVOLI_MODE) return;

    const timer = setTimeout(() => setShowStamp(true), 6000);

    return () => clearTimeout(timer);
  }, []);

  const revokeDevAccess = async () => {
    setIsRevoking(true);
    setRevokeError(null);

    try {
      const res = await fetch("/api/access", {
        method: "DELETE",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to revoke access cookie");
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      setRevokeError("Failed to revoke dev access. Please try again.");
      console.error("Failed to revoke dev access:", error);
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background — lowest layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#323138] to-[#121218] bg-left" />

      <Fog />

      <div className="relative z-20 flex flex-col h-full w-full justify-center items-center">
        <div className="bg-black/40 p-4 m-8 mx-4 rounded flex flex-col gap-6 md:w-120">
          <AnimatePresence mode="wait">
            {!showStamp ? (
              <motion.div
                key="text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                {hasExited ? (
                  <>
                    <h1 className="text-4xl font-glitch text-grey text-center">
                      Oh look, a scaredy cat!
                    </h1>
                    <p className="text-xl font-fell text-grey text-center">
                      You didn't make it through the house. Better luck next
                      time...
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="text-4xl font-glitch text-grey text-center">
                      Congratulations!
                    </h1>
                    <p className="text-xl font-fell text-grey text-center">
                      You've escaped the Haunted House!
                    </p>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="stamp"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <p className="font-fell text-grey text-xl text-center">
                  {hasExited
                    ? "Here's your consolation prize:"
                    : "Here's your well deserved stamp:"}
                </p>
                {stamp !== null ? (
                  <>
                    <Image
                      src={stamp.image_url ?? ""}
                      alt={`${stamp.stamptype.metal ? `${stamp.stamptype.metal} ` : ""}${stamp.stamptype.animal}`}
                      width={200}
                      height={200}
                    />
                    <p className="font-fell text-grey text-center">
                      You got a{" "}
                      {stamp.stamptype.metal && `${stamp.stamptype.metal} `}
                      {stamp.stamptype.animal}!
                    </p>
                  </>
                ) : (
                  <p className="font-fell text-grey">No stamp found</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Return to Tivoli / Play again */}
        {TIVOLI_MODE ? (
          <div className="w-full flex justify-center">
            <BackToTivoliButton />
          </div>
        ) : (
          <LinkButton href="/" linkText="Play again" onClick={() => {
    useGameStore.getState().resetGame();
  }} />
        )}

        {/* Dev only */}
        {/* Testing button to revoke dev access cookie, combine the real functionality into the TIVOLI_MODE button */}
        {process.env.NODE_ENV !== "production" && (
          <>
            <button
              className="text-sm text-grey mt-2"
              onClick={revokeDevAccess}
              disabled={isRevoking}
            >
              {isRevoking
                ? "Revoking access..."
                : "Revoke dev access (for testing)"}
            </button>
            {revokeError && (
              <p className="text-red-500 mt-2 text-sm">{revokeError}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
