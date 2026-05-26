"use client";

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
  const [showStamp, setShowStamp] = useState(false);
  const [isHydrated, setIsHydrated] = useState(() =>
    useGameStore.persist.hasHydrated(),
  );

  const stamp = useGameStore((s) => s.stamp);
  const hasExited = useGameStore((s) => s.hasExited);

  // Show stamp automatically after 4 seconds
  useEffect(() => {
    if (!TIVOLI_MODE) return;

    const timer = setTimeout(() => setShowStamp(true), 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (useGameStore.persist.hasHydrated()) {
      setIsHydrated(true);
      return;
    }

    const unsubscribe = useGameStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background — lowest layer */}
      <div className="absolute inset-0 bg-linear-to-b from-[#323138] to-[#121218] bg-left" />

      <Fog opacity={0.6} />

      <div className="relative z-20 flex flex-col h-full w-full justify-center items-center">
        <div className="bg-black/50 p-4 m-8 mx-4 rounded flex flex-col gap-6 w-11/12 z-50 md:w-120">
          <AnimatePresence mode="wait">
            {!TIVOLI_MODE || !showStamp ? (
              <motion.div
                key="text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                {hasExited ? (
                  <>
                    <h1 className="text-4xl font-glitch text-grey text-center max-[365px]:text-base">
                      Oh look, a scaredy cat!
                    </h1>
                    <p className="text-xl font-fell text-grey text-center max-[365px]:text-base">
                      You didn't make it through the house. Better luck next
                      time...
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="text-4xl font-glitch text-grey text-center max-[365px]:text-base">
                      Congratulations!
                    </h1>
                    <p className="text-xl font-fell text-grey text-center max-[365px]:text-base">
                      You've escaped the Haunted House!
                    </p>
                  </>
                )}
              </motion.div>
            ) : !isHydrated ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                <p className="font-fell text-grey text-xl text-center max-[365px]:text-base">
                  Loading your stamp...
                </p>
              </motion.div>
            ) : (
              <>
                <motion.div
                  key="stamp"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <p className="font-fell text-grey text-xl text-center max-[365px]:text-base">
                    {hasExited
                      ? "Here's your consolation prize:"
                      : "Here's your well deserved stamp:"}
                  </p>
                  {stamp !== null ? (
                    <>
                      <Image
                        src={stamp.image_url ?? ""}
                        alt={`${stamp.metal ? `${stamp.metal} ` : ""}${stamp.animal}`}
                        width={200}
                        height={200}
                      />
                      <p className="font-fell text-grey text-center max-[365px]:text-sm">
                        You got a {stamp.metal && `${stamp.metal} `}
                        {stamp.animal}!
                      </p>
                    </>
                  ) : (
                    <p className="font-fell text-grey max-[365px]:text-sm">
                      No stamp awarded
                    </p>
                  )}
                </motion.div>
                <div className="w-full flex justify-center">
                  {/* Revoke access and return to Tivoli if in Tivoli mode, otherwise show play again button */}
                  <BackToTivoliButton revokeAccess />
                </div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Return to Tivoli / Play again */}
        {TIVOLI_MODE ? (
          <div className="w-full flex justify-center">
            {/* <BackToTivoliButton /> */}
          </div>
        ) : (
          <LinkButton
            href="/"
            linkText="Play again"
            onClick={(event) => {
              event.preventDefault();
              useGameStore.getState().resetGame();
              router.push("/");
            }}
          />
        )}
      </div>
    </div>
  );
}
