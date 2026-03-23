import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../app/store";
import { logout, toggleMode } from "../redux/userSlice";
import "./NavBar.css";

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
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          SkillBridge<span className="logo-dot">.</span>
        </Link>
        <div className="navbar-right">
          <Link to="/jobs" className="nav-link">
            Browse Jobs
          </Link>

          {isAuthenticated && !hasFreelancerProfile && (
            <Link to="/become-a-seller" className="nav-link become-seller-link">
              Become a Seller
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <span
                onClick={onLoginClick}
                className="nav-link"
                style={{ cursor: "pointer" }}
              >
                Sign In
              </span>
              <button onClick={onRegisterClick} className="join-btn">
                {" "}
                Join{" "}
              </button>
            </>
          ) : (
            <div className="nav-profile-section">
              <div className="profile-dropdown-container">
                <div className="profile-avatar-circle">
                  {user?.fullName?.[0].toUpperCase()}
                </div>

                <div className="profile-dropdown-menu">
                  <div className="dropdown-header">
                    <span className="dropdown-name">{user?.fullName}</span>
                    <span className="dropdown-type">
                      {isSellingMode ? "Freelancer Mode" : "Client Mode"}
                    </span>
                  </div>

                  {hasFreelancerProfile && (
                    <button
                      onClick={handleToggle}
                      className="dropdown-item switch-btn"
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
                    className="dropdown-item"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout-link"
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
