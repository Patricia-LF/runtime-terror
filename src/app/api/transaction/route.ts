import { NextRequest, NextResponse } from "next/server";
import { processPayment } from "@/lib/payment";
import { setAccessCookie } from "@/lib/cookie";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const transaction = await req.json();
        // Set the API key from server environment
        transaction.api_key = process.env.API_KEY || "missing-api-key";
        const result = await processPayment(transaction);

        // Handle successful payment: unwrap and return the transaction payload
        if (result.success) {
            await setAccessCookie();
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


