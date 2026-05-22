// lib/payment.ts
import { Transaction, TransactionResponse, ApiResult } from '@/types/index'
import { parseError } from '@/lib/parseError'

const API_URL = process.env.API_URL || 'https://api.loopland.se';

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

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: {
          message: data?.message ?? `Payment failed (${res.status})`,
          status: res.status,
        },
      }
    }

    if (!data || typeof data !== 'object') {
      return {
        success: false,
        error: { message: 'Payment API returned an invalid response', status: 502 },
      }
    }

    return { success: true, data: data as TransactionResponse }

  } catch (error: unknown) {
    return { success: false, error: parseError(error) }
  }
}
