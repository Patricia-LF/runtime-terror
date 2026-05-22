import { ApiError } from "./errors";

export type Transaction = {
  identity_token: string;
  amount: number;
  api_key: string;
};

export type Animal = "lion" | "dolphin" | "toucan" | "beetlebug" | "snake";
export type Metal = "silver" | "gold" | "platinum" | null;
export type Stamp = {
  image_url: string;
  animal: Animal;
  metal: Metal;
} | null;


export type PaymentResponse = {
  success: boolean;
  data: {
    transaction_id: number;
    stamp: Stamp;
  };
  error?: ApiError;
};

export interface PaymentResult {
  success: boolean
  error?: string
  declineCode?: string
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}
