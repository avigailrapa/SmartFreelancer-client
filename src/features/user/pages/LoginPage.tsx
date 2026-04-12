import { useState } from "react"; // 1. הוספתי useEffect כאן
import { useLoginMutation } from "../redux/api";
import CloseIcon from "@mui/icons-material/Close";
import "./Auth.css";

interface LoginPageProps {
  onClose: () => void;
}

export const LoginPage = ({ onClose }: LoginPageProps) => {
  const [loginUser, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleClose = () => {
    setForm({ email: "", password: "" });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await loginUser({
        Email: form.email,
        Password: form.password,
      }).unwrap();
      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      setForm({ email: "", password: "" });
      handleClose();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="auth-overlay" onClick={handleClose}>
      <div className="auth-modal-center" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose} type="button">
          <CloseIcon />
        </button>

        <h2 className="auth-title">Sign in to your account</h2>

        {/* הוסיפי autoComplete="off" כדי שהדפדפן לא ימלא לבד */}
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              className="fiverr-input"
              name="email"
              autoComplete="new-password"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              className="fiverr-input"
              name="password"
              autoComplete="new-password" // 👈 גם כאן
              value={form.password} // 3. הוספת value לסנכרון
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            className="fiverr-submit-btn"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Connecting..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};
