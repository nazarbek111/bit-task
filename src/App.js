import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
// Импортируем компоненты
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
// Импортируем страницы
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/dashboard/Overview";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";
import Activity from "./pages/dashboard/Activity";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import TaskDetail from "./pages/TaskDetail";
// Стили
import "./styles.css";

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Navbar />

                    <Routes>
                        {/* Публичные маршруты  */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />

                        {/* Динамический роутинг для деталей задачи  */}
                        <Route path="/tasks/:id" element={<TaskDetail />} />

                        {/* Защищенный маршрут с вложенными путями (Nested Routes)  */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        >
                            {/* Индексный маршрут для дашборда */}
                            <Route index element={<Overview />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="activity" element={<Activity />} />
                        </Route>

                        {/* Обработка несуществующих страниц  */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;