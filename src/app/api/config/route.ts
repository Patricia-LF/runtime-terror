

export async function GET(): Promise<Response> {
    const raw = process.env.ENTRY_PRICE;
    const headers = {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60", // Cache for 60 seconds
    };

    if (!raw) {
        return new Response(JSON.stringify({ error: "Entry price not configured" }), {
            status: 500,
            headers,
        });
    }

    const entryPrice = Number(raw);
    if (Number.isNaN(entryPrice)) {
        return new Response(JSON.stringify({ error: "Invalid ENTRY_PRICE value" }), {
            status: 500,
            headers,
        });
    }

    return new Response(JSON.stringify({ entryPrice }), {
        status: 200,
        headers,
    });
}