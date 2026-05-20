"use client";

import { useState } from "react";
import { ApiError } from "@/types/errors";
import { PaymentResponse, Transaction } from "@/types";
import { useGameStore } from "@/store/useGameStore";

const ENTRY_PRICE = Number(process.env.NEXT_PUBLIC_ENTRY_PRICE) || 3;

type UseTransactionOptions = {
  onSuccess?: () => void;
  onUnauthorized?: () => void;
  onError?: (error: ApiError) => void;
};

export function useTransaction({
  onSuccess,
  onUnauthorized,
  onError,
}: UseTransactionOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const setStamp = useGameStore((s) => s.setStamp);

  const submitTransaction = async (identityToken: string): Promise<PaymentResponse | null> => {
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

      const data = (await res.json()) as PaymentResponse;

      if (res.status === 401) {
        onUnauthorized?.();
        return null;
      }

      if (!res.ok) {
        onError?.({
          message: data.error?.message ?? "Payment failed",
          status: res.status,
        });
        return null;
      }

      if (data.success) {
        setStamp(data.data.stamp);
        onSuccess?.();
        return data;
      }

      onError?.({
        message: data.error?.message ?? "Payment failed",
        status: data.error?.status,
      });
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