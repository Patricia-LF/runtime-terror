"use client";

import { TransactionResponse } from "@/types";

type EnterFormProps = {
  onSubmit: (identityToken: string) => Promise<TransactionResponse | null>;
  identityToken: string | null;
  isLoading: boolean;
};

export default function EnterForm({
  onSubmit,
  identityToken,
  isLoading,
}: EnterFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identityToken) return;

    await onSubmit(identityToken);
  };

  const isDisabled = isLoading || !identityToken;
  const entryPrice = process.env.NEXT_PUBLIC_ENTRY_PRICE;

  return (
    <form
      onSubmit={handleSubmit}
      className=" p-6 rounded shadow-md flex flex-col items-center w-full"
    >
      <button
        type="submit"
        disabled={isDisabled}
        className="border border-white rounded px-4 py-2 min-h-11 min-w-11 w-full text-white cursor-pointer bg-red-dark hover:opacity-80 transition focus:ring-2 focus:ring-red-dark focus:outline-none"
      >
        {isLoading ? "Processing..." : `Pay Entry Fee (${entryPrice}€)`}
      </button>
      {isDisabled && !identityToken && (
        <p className="text-red-400 text-sm mt-2">
          Unable to start payment: Identity token is missing. Return to the main
          tivoli site and try again.
        </p>
      )}
    </form>
  );
}
