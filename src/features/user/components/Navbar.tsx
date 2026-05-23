import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../app/store";
import { logout, toggleMode } from "../redux/userSlice";
import styles from "./NavBar.module.scss";

interface NavBarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export const NavBar = ({ onLoginClick, onRegisterClick }: NavBarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, isSellingMode } = useSelector(
    (state: RootState) => state.user,
  );

  const hasFreelancerProfile = !!user?.freelancerId;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleToggle = () => {
    dispatch(toggleMode());
    if (!isSellingMode) {
      navigate("/freelancer-dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          SkillBridge<span className={styles.logoDot}>.</span>
        </Link>

        <div className={styles.right}>
          <Link to="/jobs" className={styles.navLink}>
            Browse Jobs
          </Link>
          <Link to="/freelancers" className={styles.navLink}>
            Find Talent
          </Link>

          {isAuthenticated && !hasFreelancerProfile && (
            <Link to="/become-a-seller" className={styles.navLink}>
              Become a Seller
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <span onClick={onLoginClick} className={styles.navLink}>
                Sign In
              </span>
              <button onClick={onRegisterClick} className={styles.joinBtn}>
                Join
              </button>
            </>
          ) : (
            <div className={styles.profileSection}>
              <div className={styles.dropdownContainer}>
                <div className={styles.avatar}>
                  {user?.fullName?.[0].toUpperCase()}
                </div>

                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownHeader}>
                    <span className={styles.dropdownName}>
                      {user?.fullName}
                    </span>
                    <span className={styles.dropdownType}>
                      {isSellingMode ? "Freelancer Mode" : "Client Mode"}
                    </span>
                  </div>

                  {hasFreelancerProfile && (
                    <button
                      onClick={handleToggle}
                      className={styles.dropdownItem}
                    >
                      Switch to {isSellingMode ? "Buying" : "Selling"}
                    </button>
                  )}

                  <Link
                    to={
                      isSellingMode
                        ? "/freelancer-dashboard"
                        : "/client-dashboard"
                    }
                    className={styles.dropdownItem}
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className={styles.dropdownItem}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
