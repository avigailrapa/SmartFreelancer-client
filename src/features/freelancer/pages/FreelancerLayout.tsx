import { Link, Outlet } from "react-router-dom";
import "./Dashboard.css";

export const FreelancerLayout = () => {
  return (
    <div className="dashboard-wrapper">
      <nav className="sidebar">
        <ul className="sidebar-nav">
          <li>
            <Link to="profile" className="nav-link">
              Account Profile
            </Link>
          </li>
          <li>
            <Link to="matching" className="nav-link">
              Smart Matching
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
