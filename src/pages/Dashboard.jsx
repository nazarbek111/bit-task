import { NavLink, Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p>Welcome to your personal dashboard. Manage your account and view your activity.</p>
      
      <div className="dashboardLayout">
        <aside className="dashboardSidebar">
          <nav className="dashboardNav">
            <NavLink to="/dashboard" end className="dashboardNavLink">
              Overview
            </NavLink>
            <NavLink to="/dashboard/profile" className="dashboardNavLink">
              Profile
            </NavLink>
            <NavLink to="/dashboard/settings" className="dashboardNavLink">
              Settings
            </NavLink>
            <NavLink to="/dashboard/activity" className="dashboardNavLink">
              Activity
            </NavLink>
          </nav>
        </aside>
        
        <main className="dashboardContent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
