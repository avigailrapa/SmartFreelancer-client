import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../app/store";
import { login } from "../redux/userSlice";
import { useUpdateUserMutation } from "../redux/api";
import styles from "../../freelancer/pages/Dashboard.module.scss";

export const ClientProfile = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.user);
  const token = useSelector((state: RootState) => state.user.token);

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  const handleStartEdit = () => {
    setFormData({ fullName: "", email: "" });
    setIsEditing(true);
  };

  const handleCancel = () => setIsEditing(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.fullName.trim() || !formData.email.trim()) {
      alert("Please fill in both name and email.");
      return;
    }

    try {
      const updatedUser = await updateUser({
        id: user.id,
        fullName: formData.fullName,
        email: formData.email,
        freelancerId: user.freelancerId ?? null,
      }).unwrap();

      dispatch(login({ user: updatedUser, token: token! }));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Error: Could not update profile. Please try again.");
    }
  };

  if (!user) return <div className={styles.error}>No user logged in</div>;

  return (
    <div className={styles.card}>
      <div className={styles.profileHeader}>
        <h1>Hello {user.fullName}</h1>
        <p>You can update your personal information below</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          {isEditing ? (
            <input
              className={styles.formControl}
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter new name"
              required
            />
          ) : (
            <p className={styles.displayText}>{user.fullName}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Email Address</label>
          {isEditing ? (
            <input
              className={styles.formControl}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter new email"
              required
            />
          ) : (
            <p className={styles.displayText}>{user.email}</p>
          )}
        </div>

        <div className={styles.actionsFooter}>
          {!isEditing ? (
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={handleStartEdit}
            >
              Edit Profile
            </button>
          ) : (
            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
