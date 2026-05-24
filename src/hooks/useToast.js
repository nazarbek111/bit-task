import { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);

    const add = useCallback((message, type = "success") => {
        const id = ++idRef.current;
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const remove = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ add }}>
            {children}
            <div className="toastContainer">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`toast toast--${t.type}`}
                        onClick={() => remove(t.id)}
                    >
                        <span className="toastIcon">
                            {t.type === "success" && "✓"}
                            {t.type === "error" && "✕"}
                            {t.type === "info" && "·"}
                        </span>
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside ToastProvider");
    return ctx.add;
}
