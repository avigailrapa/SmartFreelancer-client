import { Outlet,Link } from "react-router-dom";
import styles from "../../freelancer/pages/Dashboard.module.scss";
export const ClientLayout = () => {
  return (
    <div className={styles.dashboardWrapper}>
      <nav className={styles.sidebar}>
        <ul className={styles.sidebarNav}>
          <li>
            <Link to="client-profile" className={styles.navLink}>
              Account Profile
            </Link>
          </li>
          <li>
            <Link to="client-jobs" className={styles.navLink}>
              My Jobs
            </Link>
          </li>
        </ul>
      </nav>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};