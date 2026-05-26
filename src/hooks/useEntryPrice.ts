import { useEffect, useState } from "react";

type EntryPrice = number | null;

export function useEntryPrice() {
    const [price, setPrice] = useState<EntryPrice>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const res = await fetch("/api/config");
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || `Config fetch failed: ${res.status}`);
                }
                const data = await res.json();
                if (data && typeof data.entryPrice === "number") {
                    if (mounted) setPrice(data.entryPrice);
                } else {
                    throw new Error("Invalid config response");
                }
            } catch (err) {
                if (!mounted) return;
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    return { price, loading, error } as const;
}
