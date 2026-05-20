"use client";

import EnterForm from "@/components/home-page/enter-form";
import Fog from "@/components/effects/Fog";
import { ApiError } from "@/types/errors";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Bats from "@/components/effects/Bats";
import HelpOverlay from "@/components/shared/HelpOverlay";
import { useUrlParams } from "@/hooks/useUrlParams";
import { UnauthorizedModal } from "@/components/ui/UnauthorizedModal";
import { useTransaction } from "@/hooks/useTransaction";
import MuteButton from "../ui/MuteButton";

export default function HomeClient() {
  const router = useRouter();
  const [error, setError] = useState<ApiError | null>(null);
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [devAccessLoading, setDevAccessLoading] = useState(false);
  const ENTRY_PRICE = Number(process.env.NEXT_PUBLIC_ENTRY_PRICE) || 3;
  const isTivoliMode = process.env.NEXT_PUBLIC_TIVOLI_MODE === "true";

  const { identityToken } = useUrlParams();
  if (identityToken) {
    console.log("Identity Token from URL:", identityToken);
  }

  const { submitTransaction, isLoading } = useTransaction({
    onSuccess: () => router.push("/haunted-house"),
    onUnauthorized: () => setShowUnauthorizedModal(true),
    onError: setError,
  });

  const handleDevAccess = async () => {
    setDevAccessLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/access", { method: "POST" });

      if (!res.ok) {
        throw new Error("Could not create access cookie");
      }

      router.push("/haunted-house");
    } catch {
      setError({ message: "Dev access failed. Could not set cookie." });
    } finally {
      setDevAccessLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background — lowest layer */}
      <div className="absolute inset-0 bg-[url('/assets/images/Home-bg.png')] bg-cover bg-bottom" />
      <Bats />
      <Fog />

      <MuteButton positionClass="right-4" />

      {/* Content — top layer */}
      <div className="relative z-20 flex flex-col w-full items-center">
        <h1 className="font-eater text-red-800 flex w-full text-4xl m-8 justify-center md:text-5xl leading-normal">
          Runtime terror
        </h1>
        <div className="flex flex-col h-full items-center md:self-end">
          {/* Combined info and payment box */}
          <div className="bg-black/40 p-4 mx-10 rounded flex flex-col gap-6 md:w-100">
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-4">
                <h2 className="font-glitch text-2xl flex justify-center text-grey">
                  Welcome!
                </h2>
                <h3 className="font-fell text-grey text-xl">
                  Are you a scaredy cat — or do you laugh in the face of horror?
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
            {isTivoliMode ? (
              <div className="flex flex-col gap-4">
                {/* <h3 className="text-white text-xl">
                  Enter the house for {ENTRY_PRICE}€
                </h3> */}
                <EnterForm
                  onSubmit={submitTransaction}
                  identityToken={identityToken}
                  isLoading={isLoading}
                />
                {error && (
                  <p className="text-red-400 mt-2">Error: {error.message}</p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => router.push("/haunted-house")}
                className="border border-red-dark text-white bg-red-dark rounded px-4 py-2 cursor-pointer md:bg-transparent border-white hover:bg-red-dark hover:text-white hover:border-red-dark transition font-fell tracking-widest"
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
      </div>

      <UnauthorizedModal
        isOpen={showUnauthorizedModal}
        onClose={() => setShowUnauthorizedModal(false)}
      />
    </div>
  );
}
