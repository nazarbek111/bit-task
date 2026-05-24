import { useState, useCallback } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./hooks/useToast";
import { useFetch } from "./hooks/useFetch";
import { useKeyboardShortcut } from "./hooks/useKeyboardShortcut";
import { taskService } from "./services/taskService";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import CommandPalette from "./components/CommandPalette";

import Home from "./pages/Home";
import About from "./pages/About";
import Changelog from "./pages/Changelog";
import Shortcuts from "./pages/Shortcuts";
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/dashboard/Overview";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";
import Activity from "./pages/dashboard/Activity";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import TaskDetail from "./pages/TaskDetail";

import "./styles.css";

/**
 * Holds palette state at app level so any page can open it.
 * Wraps the router so navigation works from inside the palette.
 */
function AppShell() {
    const { user } = useAuth();
    const [paletteOpen, setPaletteOpen] = useState(false);

    // Quick-load tasks just for palette suggestions (only when logged in).
    const { data: tasks } = useFetch(
        () => (user ? taskService.getByUser(user.username) : Promise.resolve([])),
        [user?.username]
    );

    const openPalette  = useCallback(() => setPaletteOpen(true), []);
    const closePalette = useCallback(() => setPaletteOpen(false), []);

    // ⌘K / Ctrl+K opens the palette anywhere in the app.
    useKeyboardShortcut("k", openPalette, { meta: true });

    return (
        <>
            <Navbar onOpenPalette={openPalette} />
            <CommandPalette open={paletteOpen} onClose={closePalette} tasks={tasks || []} />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/changelog" element={<Changelog />} />
                <Route path="/shortcuts" element={<Shortcuts />} />
                <Route path="/login" element={<Login />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />

                <Route
                    path="/dashboard"
                    element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
                >
                    <Route index element={<Overview />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="activity" element={<Activity />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ToastProvider>
                    <BrowserRouter>
                        <AppShell />
                    </BrowserRouter>
                </ToastProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}