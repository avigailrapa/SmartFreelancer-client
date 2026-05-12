import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../app/store";
import { login } from "../redux/userSlice";
import { useUpdateUserMutation } from "../redux/api";

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
    setFormData({
      fullName: "",
      email: "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

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

  if (!user) return <div className="error-msg">No user logged in</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="profile-header">
          <h2>Hello {user.fullName} </h2>
          <p>You can update your personal information below</p>
        </div>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Full Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter new name"
                required
              />
            ) : (
              <span className="info-text">{user.fullName}</span>
            )}
          </div>

          <div className="form-group">
            <label>Email Address:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter new email"
                required
              />
            ) : (
              <span className="info-text">{user.email}</span>
            )}
          </div>

          <div className="actions">
            {!isEditing ? (
              <button
                type="button"
                className="edit-btn"
                onClick={handleStartEdit}
              >
                Edit Profile
              </button>
            ) : (
              <div className="button-group">
                <button
                  type="submit"
                  className="save-btn"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
