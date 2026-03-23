import { useState } from "react";
import { useRegisterMutation } from "../redux/api";
import CloseIcon from "@mui/icons-material/Close";
import "./Auth.css";

interface RegisterPageProps {
  onClose: () => void;
}

export const RegisterPage = ({ onClose }: RegisterPageProps) => {
  const [registerUser, { isLoading, error }] = useRegisterMutation();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await registerUser(form).unwrap();
      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      if (result.user) {
        localStorage.setItem("user", result.user);
      }
      setForm({ fullName: "", email: "", password: "" });
      onClose();
    } catch (err) {
      console.error("Register failed", err);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div
        className="auth-modal-center register-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          <CloseIcon />
        </button>

        <div className="auth-content">
          <h2 className="auth-title">Join SkillBridge</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                className="fiverr-input"
                placeholder="Enter your full name"
                autoComplete="new-password"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="fiverr-input"
                placeholder="Enter your email"
                autoComplete="new-password"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="fiverr-input"
                placeholder="Create a password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="fiverr-submit-btn"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Continue"}
            </button>
          </form>

          {error && (
            <p className="auth-error-msg">
              Registration failed. Please try again.
            </p>
          )}

          <p className="auth-footer-text">
            By joining, you agree to the SkillBridge Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};
