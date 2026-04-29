import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // смотрим локал если был логин восстан
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("bittask.user");
        return saved ? JSON.parse(saved) : null;
    });
    // схр обьяек с именем и временем для логина
    const login = (username, password) => {
        if (!username || !password) return false;
        const userData = { username, loggedInAt: new Date().toISOString() };
        localStorage.setItem("bittask.user", JSON.stringify(userData));
        setUser(userData);
        return true;
    };

    const logout = () => {
        localStorage.removeItem("bittask.user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}