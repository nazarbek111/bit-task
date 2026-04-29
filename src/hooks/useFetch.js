import { useState, useEffect } from "react";

export function useFetch(fetchFn, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await fetchFn();
                if (!cancelled) setData(result);
            } catch (err) {
                if (!cancelled) setError(err.message || "Something went wrong");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger, ...deps]);

    const refetch = () => setTrigger((n) => n + 1);

    return { data, loading, error, refetch };
}