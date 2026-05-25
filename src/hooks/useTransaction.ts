"use client";

import { useState } from "react";
import { ApiError } from "@/types/errors";
import { TransactionResponse, Transaction } from "@/types";
import { useGameStore } from "@/store/useGameStore";

const ENTRY_PRICE = Number(process.env.NEXT_PUBLIC_ENTRY_PRICE) || 3;

type UseTransactionOptions = {
  onSuccess?: () => void;
  onUnauthorized?: () => void;
  onError?: (error: ApiError) => void;
};

function getPaymentErrorMessage(status: number, fallback?: string): string {
  switch (status) {
    case 401:
      return fallback ?? "Payment not authorized";
    case 402:
      return fallback ?? "Insufficient funds";
    case 404:
      return fallback ?? "Amusement not found";
    case 409:
      return fallback ?? "This amusement no longer accepts transactions";
    default:
      return fallback ?? "Payment failed";
  }
}

export function useTransaction({
  onSuccess,
  onUnauthorized,
  onError,
}: UseTransactionOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const setStamp = useGameStore((s) => s.setStamp);

  const submitTransaction = async (identityToken: string): Promise<TransactionResponse | null> => {
    if (!identityToken) {
      onError?.({
        message: "Missing identity token",
      });
      return null;
    }

    setIsLoading(true);

    try {
      const transaction: Transaction = {
        identity_token: identityToken,
        amount: ENTRY_PRICE,
        api_key: "runtime-terror", // Placeholder, will be set by server
      };

      const res = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      });

      if (res.status === 401) {
        onUnauthorized?.();
        return null;
      }

      const payload = (await res.json()) as TransactionResponse | { message?: string };

      console.log("Transaction response:", {
        status: res.status,
        payload,
      });

      if (!res.ok) {
        const fallbackMessage =
          payload && typeof payload === "object" && "message" in payload
            ? payload.message
            : undefined;

        onError?.({
          message: getPaymentErrorMessage(res.status, fallbackMessage),
          status: res.status,
        });
        return null;
      }

      // Success: payload is the TransactionResponse
      setStamp((payload as TransactionResponse).stamp);
      onSuccess?.();
      console.log("Transaction successful:", payload);
      return payload as TransactionResponse;
    } catch (error) {
      onError?.({
        message: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  return {
    submitTransaction,
    isLoading,
  };
}