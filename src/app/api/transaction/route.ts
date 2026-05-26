import { NextRequest, NextResponse } from "next/server";
import { processPayment } from "@/lib/payment";
import { setAccessCookie } from "@/lib/cookie";
import { Transaction } from "@/types";

const ENTRY_PRICE = Number(process.env.ENTRY_PRICE ?? 3);

type TransactionRequestBody = Pick<Transaction, "identity_token">;

function isTransactionRequestBody(value: unknown): value is TransactionRequestBody {
    return (
        typeof value === "object" &&
        value !== null &&
        "identity_token" in value &&
        typeof (value as { identity_token?: unknown }).identity_token === "string" &&
        (value as { identity_token: string }).identity_token.trim().length > 0
    );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: unknown = await req.json();

        if (!isTransactionRequestBody(body)) {
            return NextResponse.json(
                { message: "Invalid transaction request" },
                { status: 400 },
            );
        }

        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { message: "Payment API is not configured" },
                { status: 500 },
            );
        }

        if (!Number.isFinite(ENTRY_PRICE) || ENTRY_PRICE <= 0) {
            return NextResponse.json(
                { message: "Invalid entry price configuration" },
                { status: 500 },
            );
        }

        const result = await processPayment({
            identity_token: body.identity_token,
            amount: ENTRY_PRICE,
            api_key: apiKey,
        });

        // Handle successful payment: unwrap and return the transaction payload
        if (result.success) {
            await setAccessCookie(); // Set access cookie on successful payment
            return NextResponse.json(result.data, { status: 200 });
        }

        // Handle payment errors with appropriate status codes and a simple message body
        const status = result.error?.status ?? 400;
        const message = result.error?.message ?? "Payment failed";
        return NextResponse.json({ message }, { status });
    } catch (error) {
        console.error("Error processing transaction:", error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: "Internal Server Error",
                    status: 500,
                },
            },
            { status: 500 }
        );
    }
}


