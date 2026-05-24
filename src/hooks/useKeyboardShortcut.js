import { useEffect } from "react";

export function useKeyboardShortcut(key, handler, { meta = false, ctrl = false } = {}) {
    useEffect(() => {
        const onKeyDown = (event) => {
            const matchKey = event.key.toLowerCase() === key.toLowerCase();
            const matchMeta = meta ? event.metaKey || event.ctrlKey : true;
            const matchCtrl = ctrl ? event.ctrlKey : true;

            if (matchKey && matchMeta && matchCtrl) {
                event.preventDefault();
                handler(event);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [key, handler, meta, ctrl]);
}
