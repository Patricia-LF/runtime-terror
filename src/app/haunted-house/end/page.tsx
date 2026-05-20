"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TIVOLI_MODE } from "@/lib/gameConfig";
import { useGameStore } from "@/store/useGameStore";
import Image from "next/image";


export default function EndPage() {
  const router = useRouter();
  const [isRevoking, setIsRevoking] = useState(false);
  const [revokeError, setRevokeError] = useState<string | null>(null);

  const revokeDevAccess = async () => {
    setIsRevoking(true);
    setRevokeError(null);

    try {
      const res = await fetch("/api/access", { method: "DELETE", cache: "no-store" });

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

  const stamp = useGameStore((s) => s.stamp);

  const handleTivoliReturn = () => {
    useGameStore.getState().resetGame();
    // TODO: Replace with actual tivoli site URL and 
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Congratulations! You've escaped the Hunted House!</h1>

      {/* Testing button to revoke dev access cookie, combine the real functionality into the TIVOLI_MODE button */}
      <button
        className="text-sm text-gray-500 mt-2"
        onClick={revokeDevAccess}
        disabled={isRevoking}
      >
        {isRevoking ? "Revoking access..." : "Revoke dev access (for testing)"}
      </button>
      {revokeError && <p className="text-red-500 mt-2 text-sm">{revokeError}</p>}


      {TIVOLI_MODE ? (
        <button
          onClick={handleTivoliReturn}
          className="text-red-800 underline mt-4 px-4 py-2 hover:opacity-80"
        >
          Back to Tivoli
        </button>
      ) : (
        <Link href="/" className="text-red-800 underline mt-4">
          Play again
        </Link>
      )}

      {(stamp !== null) ? (
        <>
          <h2 className="bg-red-600">
            You got a{" "}
            {stamp.stamptype.metal && `${stamp.stamptype.metal} `}
            {stamp.stamptype.animal}
          </h2>
          <Image
            src={stamp.image_url}
            alt={`${stamp.stamptype.metal ? `${stamp.stamptype.metal} ` : ""}${stamp.stamptype.animal}`}
            width={200}
            height={200}
          />
        </>
      ) :
        (<p className="bg-red-600">No stamp</p>)}
    </div>
  );
}