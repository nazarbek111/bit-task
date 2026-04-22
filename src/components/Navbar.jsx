import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navBrand">
                <NavLink to="/" className="brandLink">
                    BitTask
                </NavLink>
            </div>
            <ul className="navLinks">
                <li>
                    <NavLink to="/" className="navLink" end>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about" className="navLink">
                        About
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/services" className="navLink">
                        Services
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/contact" className="navLink">
                        Contact
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard" className="navLink">
                        Dashboard
                    </NavLink>
                </li>
                {user ? (
                    <li>
                        <button className="navLink navAuthBtn" onClick={handleLogout}>
                            Logout ({user.username})
                        </button>
                    </li>
                ) : (
                    <li>
                        <NavLink to="/login" className="navLink">
                            Login
                        </NavLink>
                    </li>
                )}
            </ul>
            <button
                className="themeToggleBtn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
                {theme === "light" ? "🌙" : "☀️"}
            </button>
        </nav>
    );
}