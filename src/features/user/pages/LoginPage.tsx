import { useState, useEffect } from "react";
import { useLoginMutation } from "../redux/api";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Auth.module.scss"; // יבוא מותאם ל-Modules

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
    <div className={styles.authOverlay} onClick={handleClose}>
      <div
        className={styles.authModalCenter}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={handleClose} type="button">
          <CloseIcon />
        </button>

        <h2 className={styles.authTitle}>Sign in to your account</h2>

        {status && (
          <div className={`${styles.statusMessage} ${styles[status.type]}`}>
            {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              className={styles.fiverrInput}
              name="email"
              autoComplete="none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              className={styles.fiverrInput}
              name="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            className={styles.fiverrSubmitBtn}
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
