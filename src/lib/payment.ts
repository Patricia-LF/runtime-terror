// lib/payment.ts
import { Transaction, TransactionResponse, ApiResult } from '@/types/index'
import { parseError } from '@/lib/parseError'

export async function processPayment(
  payload: Transaction
): Promise<ApiResult<TransactionResponse>> {
  try {
    const res = await fetch('https://api.loopland.se/transactions', {
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
        error: { message: data?.message ?? 'Payment failed', status: res.status },
      }
    }

    return { success: true, data: data as TransactionResponse }

  } catch (error: unknown) {
    return { success: false, error: parseError(error) }
  }
}
