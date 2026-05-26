// lib/payment.ts
import { Transaction, TransactionResponse, ApiResult } from '@/types/index'
import { parseError } from '@/lib/parseError'

const API_URL = process.env.API_URL || 'https://api.loopland.se';

function isTransactionResponse(value: unknown): value is TransactionResponse {
  if (!value || typeof value !== 'object') return false;

  const response = value as TransactionResponse;
  return (
    typeof response.transaction_id === 'number' &&
    typeof response.amount === 'number' &&
    (response.stamp === null || (
      typeof response.stamp === 'object' &&
      response.stamp !== null &&
      typeof response.stamp.animal === 'string' &&
      typeof response.stamp.image_url === 'string' &&
      (response.stamp.metal === null || typeof response.stamp.metal === 'string')
    ))
  );
}

export async function processPayment(
  payload: Transaction
): Promise<ApiResult<TransactionResponse>> {
  try {
    const res = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data: unknown = await res.json();

    if (!res.ok) {
      const fallbackMessage =
        data && typeof data === 'object' && 'message' in data && typeof (data as { message?: unknown }).message === 'string'
          ? (data as { message: string }).message
          : undefined;

      return {
        success: false,
        error: {
          message: fallbackMessage ?? `Payment failed (${res.status})`,
          status: res.status,
        },
      }
    }

    if (!isTransactionResponse(data)) {
      return {
        success: false,
        error: { message: 'Payment API returned an invalid response', status: 502 },
      }
    }

    return { success: true, data }

  } catch (error: unknown) {
    return { success: false, error: parseError(error) }
  }
}
