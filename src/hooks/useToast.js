import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

let id = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const add = useCallback((message, type = "success") => {
        const key = ++id;
        setToasts((prev) => [...prev, { id: key, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== key));
        }, 3000);
    }, []);

    const remove = useCallback((key) => {
        setToasts((prev) => prev.filter((t) => t.id !== key));
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
                            {t.type === "error"   && "✕"}
                            {t.type === "info"    && "·"}
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