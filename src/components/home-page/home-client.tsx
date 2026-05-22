"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { TIVOLI_MODE } from "@/lib/gameConfig";

import EnterForm from "@/components/home-page/enter-form";
import Fog from "@/components/effects/Fog";
import Bats from "@/components/effects/Bats";
import HelpOverlay from "@/components/shared/HelpOverlay";
import MuteButton from "../ui/MuteButton";
import { FadeOverlay } from "@/components/shared/FadeOverlay";

import { ApiError } from "@/types/errors";
import { useUrlParams } from "@/hooks/useUrlParams";
import { useTransaction } from "@/hooks/useTransaction";
import { useGameStore } from "@/store/useGameStore";
import { useFadeStore } from "@/store/useFadeStore";

import { BackToTivoliButton } from "../shared/BackToTivoliButton";
import { UnauthorizedModal } from "@/components/ui/UnauthorizedModal";
import { ErrorModal } from "../ui/ErrorModal";

export default function HomeClient() {
  const router = useRouter();
  const [devAccessLoading, setDevAccessLoading] = useState(false);

  const { isFading, setFading } = useFadeStore();
  useEffect(() => {
    setFading(false);
  }, []);

  /* const ENTRY_PRICE = Number(process.env.NEXT_PUBLIC_ENTRY_PRICE) || 3; */
  const isPlayingGuest = useGameStore((s) => s.isPlayingGuest);
  const setIsPlayingGuest = useGameStore((s) => s.setIsPlayingGuest);

  const navigateWithFade = (path: string) => {
    setFading(true);
    setTimeout(() => {
      router.push(path);
    }, 800);
  };

  const { identityToken } = useUrlParams();
  if (identityToken) {
    console.log("Identity Token from URL:", identityToken);
  }

  type ModalType = "unauthorized" | "error" | null;
  const [modal, setModal] = useState<ModalType>(null);
  const [error, setError] = useState<ApiError | null>(null);


  const { submitTransaction, isLoading } = useTransaction({
    onSuccess: () => {
      setIsPlayingGuest(true);
      setError(null);
      setModal(null);
    },
    onUnauthorized: () => { setError(null); setModal("unauthorized"); },
    onError: (err) => { setError(err); setModal("error"); },
  });

  const handleDevAccess = async () => {
    setDevAccessLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/access", { method: "POST" });

      if (!res.ok) {
        throw new Error("Could not create access cookie");
      }

      navigateWithFade("/haunted-house");
    } catch {
      setError({ message: "Dev access failed. Could not set cookie." });
    } finally {
      setDevAccessLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <FadeOverlay isActive={isFading} />

      {/* Background — lowest layer */}
      <div className="absolute inset-0 bg-[url('/assets/images/Home-bg.png')] bg-cover bg-bottom" />
      <Bats />
      <Fog />

      <MuteButton positionClass="right-0" />
      <div className="absolute w-full flex justify-left m-6">
        {TIVOLI_MODE && <BackToTivoliButton />}
      </div>

      {/* Content — top layer */}
      <div className="relative z-20 flex flex-col w-full h-full items-center">
        <h1 className="font-eater text-red-800 flex w-full text-4xl my-18 justify-center md:text-5xl leading-normal">
          Runtime terror
        </h1>
        {!isPlayingGuest ? (
          // Show Entry information and entry form/button before user is allowed in
          <div className="flex flex-col h-full items-center md:self-end">
            {/* Combined info and payment box */}
            <div className="bg-black/40 p-4 mx-10 rounded flex flex-col gap-6 md:w-100">
              <div className="relative flex items-start gap-2">
                <div className="flex flex-col gap-4">
                  <h2 className="font-glitch text-3xl my-1 flex justify-center text-grey">
                    Welcome!
                  </h2>
                  <h3 className="font-fell text-grey text-xl">
                    Are you a scaredy cat — or do you laugh in the face of
                    horror?
                  </h3>
                  <h3 className="font-fell text-grey text-xl">
                    Enter Runtime Terror and find out if you can handle what's
                    inside.
                  </h3>
                  <h3 className="font-fell text-grey text-xl">
                    Don't forget to turn on the sound 🔊🎧 to get the full
                    experience.
                  </h3>
                </div>
                <HelpOverlay />
              </div>

              {/* Payment or free entry depending on tivoli mode */}
              {TIVOLI_MODE ? (
                <div className="flex flex-col gap-4">
                  {/* <h3 className="text-white text-xl">
                  Enter the house for {ENTRY_PRICE}€
                </h3> */}
                  <EnterForm
                    onSubmit={submitTransaction}
                    identityToken={identityToken}
                    isLoading={isLoading}
                  />
                  {error && modal !== "error" && (
                    <p className="text-red-400 mt-2">Error: {error.message}</p>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPlayingGuest(true)}
                  className="border text-white bg-red-dark rounded px-4 py-2 min-h-11 min-w-11 cursor-pointer md:bg-transparent border-white hover:bg-red-dark hover:text-white transition font-fell tracking-widest"
                >
                  Enter if you dare
                </button>
              )}

              {/* Dev access button — only in development */}
              {process.env.NODE_ENV !== "production" && (
                <button
                  type="button"
                  onClick={handleDevAccess}
                  disabled={devAccessLoading}
                  className="text-white underline disabled:opacity-50 text-sm"
                >
                  {devAccessLoading
                    ? "Setting dev access..."
                    : "Enter house (dev cookie test)"}
                </button>
              )}
            </div>
          </div>
        ) : (
          // Hide entry text and show pointing arrow when user is allowed to enter house
          <button
            onClick={() => navigateWithFade("/haunted-house")}
            aria-label="Go to next room"
            className="
              absolute
              bottom-12
              p-28
              ml-4
              flex flex-col
              items-center
              justify-center
              gap-4
              cursor-pointer group
            "
          >
            <div
              className="text-6xl text-gray-300"
              style={{
                animation: "arrow-bounce 1s infinite",
              }}
            >
              ↑
            </div>
          </button>
        )}
      </div>

      <UnauthorizedModal
        isOpen={modal === "unauthorized"}
        onClose={() => setModal(null)}
      />
      <ErrorModal 
      message={error?.message ?? "An unknown error occurred."} 
      isOpen={modal === "error"} 
      onClose={() => { setError(null); setModal(null); }} 
      />
    </div>
  );
}

