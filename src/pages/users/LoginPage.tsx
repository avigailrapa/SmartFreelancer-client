import { useState } from "react";
import { useLoginMutation } from "../../features/user/redux/api";
import { useNavigate, Link } from "react-router-dom";

export const LoginPage = () => {
  const [loginUser, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await loginUser(form).unwrap();
      setForm({
        userName: "",
        password: "",
      });
      navigate("/");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="auth-page">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          placeholder="User Name"
          value={form.userName}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red" }}>
          Login failed. Please check your credentials.
        </p>
      )}

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};
