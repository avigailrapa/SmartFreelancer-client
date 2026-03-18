import { useSelector, useDispatch } from "react-redux";
import { logout } from "./user/redux/userSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../app/store";

export const HomePage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}>
      <h1>Smart Freelancer</h1>
      
      {user ? (
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px", display: "inline-block" }}>
          <h2>שלום, {user.fullName}! 👋</h2>
          <p>איזה כיף שחזרת אלינו.</p>
          <p><strong>האימייל שלך:</strong> {user.email}</p>
          <button 
            onClick={handleLogout}
            style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: "5px" }}
          >
            התנתקות
          </button>
        </div>
      ) : (
        <div>
          <p>נראה שאתה לא מחובר.</p>
          <button onClick={() => navigate("/login")} style={{ marginRight: "10px" }}>התחברות</button>
          <button onClick={() => navigate("/register")}>הרשמה</button>
        </div>
      )}
    </div>
  );
};