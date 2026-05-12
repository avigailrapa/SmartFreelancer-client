import { Link, Outlet } from "react-router-dom";
import "../../freelancer/pages/Dashboard.css";
export const ClientLayout = () => {
  return (
    <div className="dashboard-wrapper">
      <nav className="sidebar">
        <ul className="sidebar-nav">
          <li>
            <Link to="client-profile" className="nav-link">
              Account Profile
            </Link>
          </li>
          <li>
            <Link to="client-jobs" className="nav-link">
            My Jobs
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
