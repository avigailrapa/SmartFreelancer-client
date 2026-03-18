import type { RootState } from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export const NavBar = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="logo">
            SkillBridge
            <span className="logo-dot">.</span>
          </Link>
        </div>

        <div className="navbar-right">
          {isAuthenticated ? (
            <div className="user-section">
              {!user?.freelancerId ? (
                <Link to="/become" className="nav-link become-btn">
                  Become a Seller
                </Link>
              ) : (
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              )}

              <span className="user-greeting">Hi, {user?.fullName}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">
                Sign In
              </Link>
              <Link to="/register" className="join-btn">
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
