import { ApiError } from "./errors";

export type Transaction = {
  identity_token: string;
  amount: number;
  api_key: string;
};

export type PaymentResponse = {
  success: boolean;
  data: {
    id: number;
    stamp: {
      id: number;
      image_url: string;
      stamptype: {
        animal: string;
        image_url: string;
        metal: string | null;
      };
    };
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
