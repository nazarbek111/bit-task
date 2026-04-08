import { NavLink } from "react-router-dom";

export default function Navbar() {
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
      </ul>
    </nav>
  );
}
