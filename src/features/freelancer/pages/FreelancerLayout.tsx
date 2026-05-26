import { NavLink, Outlet } from "react-router-dom";
import styles from "./Dashboard.module.scss";

export const FreelancerLayout = () => {
  return (
    <div className={styles.dashboardWrapper}>
      <nav className={styles.sidebar}>
        <ul className={styles.sidebarNav}>
          <li>
            <NavLink 
              to="profile" 
              className={({ isActive }) => 
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              Account Profile
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="matching" 
              className={({ isActive }) => 
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              Optimal Jobs
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="my-proposals" 
              className={({ isActive }) => 
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              My Proposals
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="freelancer-jobs" 
              className={({ isActive }) => 
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              My Jobs
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};