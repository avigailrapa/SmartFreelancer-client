import { useState, useEffect } from "react"; // הוספנו useEffect
import { useLoginMutation } from "../redux/api";
import CloseIcon from "@mui/icons-material/Close";
import "./Auth.css";

interface LoginPageProps {
  onClose: () => void;
}

export const LoginPage = ({ onClose }: LoginPageProps) => {
  const [loginUser, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const resetForm = () => {
    setForm({ email: "", password: "" });
    setStatus(null);
  };

  useEffect(() => {
    resetForm();
  }, []);

  const handleClose = () => {
    resetForm(); 
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    try {
      const result = await loginUser({
        Email: form.email,
        Password: form.password,
      }).unwrap();

      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      setStatus({ type: "success", text: "Login successful!" });

      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      setStatus({
        type: "error",
        text: "Invalid email or password. Please try again.",
      });
    }
  };

  return (
    <div className="auth-overlay" onClick={handleClose}>
      <div className="auth-modal-center" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose} type="button">
          <CloseIcon />
        </button>

        <h2 className="auth-title">Sign in to your account</h2>

        {status && (
          <div className={`status-message ${status.type}`}>{status.text}</div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              className="fiverr-input"
              name="email"
              autoComplete="none" 
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
              autoComplete="new-password" 
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            className="fiverr-submit-btn"
            type="submit"
            disabled={isLoading || status?.type === "success"}
          >
            {isLoading ? "Connecting..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};
