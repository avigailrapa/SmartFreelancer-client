import { useState, useEffect } from "react";
import { useRegisterMutation } from "../redux/api";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Auth.module.scss";

interface RegisterPageProps {
  onClose: () => void;
}

export const RegisterPage = ({ onClose }: RegisterPageProps) => {
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [status, setStatus] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const resetForm = () => {
    setForm({ fullName: "", email: "", password: "" });
    setStatus(null);
  };

  useEffect(() => {
    resetForm();
  }, []);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    try {
      const result = await registerUser(form).unwrap();

      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      if (result.user) {
        localStorage.setItem("user", result.user);
      }

      setStatus({ type: "success", text: "Registration successful!" });

      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      console.error("Register failed", err);
      setStatus({
        type: "error",
        text: "Registration failed. Please try again.",
      });
    }
  };

  return (
    <div className={styles.authOverlay} onClick={handleClose}>
      <div
        className={`${styles.authModalCenter} ${styles.registerModal}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={handleClose} type="button">
          <CloseIcon />
        </button>

        <div className={styles.authContent}>
          <h2 className={styles.authTitle}>Join SkillBridge</h2>

          {status && (
            <div className={`${styles.statusMessage} ${styles[status.type]}`}>
              {status.text}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                className={styles.fiverrInput}
                placeholder="Enter your full name"
                autoComplete="new-password"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                className={styles.fiverrInput}
                placeholder="Enter your email"
                autoComplete="new-password"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                className={styles.fiverrInput}
                placeholder="Create a password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className={styles.fiverrSubmitBtn}
              type="submit"
              disabled={isLoading || status?.type === "success"}
            >
              {isLoading ? "Creating account..." : "Continue"}
            </button>
          </form>

          <p className={styles.authFooterText}>
            By joining, you agree to the SkillBridge Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};
