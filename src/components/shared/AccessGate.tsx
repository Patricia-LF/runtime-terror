"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { BackToTivoliButton } from "../shared/BackToTivoliButton";
import HauntedHouseShell from "@/components/rooms/HauntedHouseShell";

type AccessGateProps = {
  children: React.ReactNode;
};

export default function AccessGate({ children }: AccessGateProps) {
  const isPlayingGuest = useGameStore((s) => s.isPlayingGuest);
  const [isHydrated, setIsHydrated] = useState(() =>
    useGameStore.persist.hasHydrated(),
  );

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

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  if (!isPlayingGuest) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6 py-12 text-center">
        <div className="max-w-md rounded border border-white bg-brown-dark p-8 text-white shadow-lg">
          <h1 className="font-glitch text-2xl text-grey">Access unavailable</h1>
          <p className="mt-4 font-fell text-base text-grey">
            We could not verify your access cookie on this device. On some
            mobile browsers, the cookie may be blocked.
          </p>
          <p className="mt-3 font-fell text-base text-grey">
            Return to Loopland and start again from the main flow.
          </p>
          <div className="mt-6 flex justify-center">
            <BackToTivoliButton />
          </div>
        </div>
      </div>
    );
  }

  return <HauntedHouseShell>{children}</HauntedHouseShell>;
}
