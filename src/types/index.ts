import { ApiError } from "./errors";

export type Transaction = {
  identity_token: string;
  amount: number;
  api_key: string;
};

export type Animal = "lion" | "dolphin" | "toucan" | "beetlebug" | "snake";

export type Metal = "silver" | "gold" | "platinum" | null;

export type Stamp = {
  animal: Animal;
  image_url: string;
  metal: Metal;
} | null;


export type TransactionResponse = {
  transaction_id: number;
  amount: number;
  stamp: Stamp;
};

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

export interface PaymentResult {
  success: boolean
  error?: string
  declineCode?: string
}

