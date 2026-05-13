import { Link, Outlet, useLocation } from "react-router-dom";
import "./Dashboard.css";

export const FreelancerLayout = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="dashboard-wrapper">
      <nav className="sidebar">
        <ul className="sidebar-nav">
          <li>
            <Link
              to="profile"
              className={`nav-link ${isActive("profile") ? "active" : ""}`}
            >
              👤 Account Profile
            </Link>
          </li>
          <li>
            <Link
              to="matching"
              className={`nav-link ${isActive("matching") ? "active" : ""}`}
            >
              💼 My Jobs
            </Link>
          </li>
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
