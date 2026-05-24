import { createContext, useContext, useCallback, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // Persistence is now delegated to a single custom hook (no inline localStorage).
    const [user, setUser] = useLocalStorage("bittask.user", null);

    const login = useCallback((username, password) => {
        if (!username || !password) return false;
        setUser({ username, loggedInAt: new Date().toISOString() });
        return true;
    }, [setUser]);

    const logout = useCallback(() => setUser(null), [setUser]);

    // Memoise so children don't re-render on unrelated parent updates.
    const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}