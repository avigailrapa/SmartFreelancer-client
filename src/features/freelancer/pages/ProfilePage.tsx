import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import {
  useGetFreelancerByIdQuery,
  useUpdateFreelancerMutation,
} from "../redux/api";
import type { Freelancer } from "../../../types/freelancer";
import styles from "./Dashboard.module.scss";

export const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user.user);

  const {
    data: freelancer,
    isLoading,
    isError,
  } = useGetFreelancerByIdQuery(user?.freelancerId ?? 0, {
    skip: !user?.freelancerId,
  });

  const [updateFreelancer, { isLoading: isUpdating }] =
    useUpdateFreelancerMutation();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    bio: "",
    hourlyRate: 0,
    availableHours: 0,
    experienceLevel: 0,
  });

  useEffect(() => {
    if (freelancer) {
      setFormData({
        userName: freelancer.userName || "",
        bio: freelancer.bio || "",
        hourlyRate: freelancer.hourlyRate || 0,
        availableHours: freelancer.availableHours || 0,
        experienceLevel: freelancer.experienceLevel || 0,
      });
    }
  }, [freelancer]);

  const handleStartEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (freelancer) {
      setFormData({
        userName: freelancer.userName,
        bio: freelancer.bio,
        hourlyRate: freelancer.hourlyRate,
        availableHours: freelancer.availableHours,
        experienceLevel: freelancer.experienceLevel,
      });
    }
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    const isNumeric = name !== "bio";
    setFormData((prev) => ({
      ...prev,
      [name]: isNumeric ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!freelancer) return;

    try {
      const updatedProfile: Freelancer = {
        ...freelancer,
        ...formData,
      };

      await updateFreelancer(updatedProfile).unwrap();
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err: any) {
      console.error("Failed to update:", err);
      alert("Update failed. Please try again.");
    }
  };

  if (isLoading)
    return <div className={styles.loading}>Loading Profile...</div>;
  if (isError)
    return <div className={styles.error}>Error loading profile data.</div>;

  return (
    <div className={styles.card}>
      <div className={styles.profileHeader}>
        <h1>Professional Profile</h1>
        <p>
          Welcome, {freelancer?.userName || "freelancer"}. Manage your
          professional settings here.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.formGroup}>
          <label>Name</label>
          {isEditing ? (
            <input
              type="text"
              name="userName"
              className={styles.formControl}
              value={formData.userName}
              onChange={handleChange}
              required
            />
          ) : (
            <p className={styles.displayText}>
              {freelancer?.userName || "No name set"}
            </p>
          )}
        </div>

        {/* Bio Section */}
        <div className={styles.formGroup}>
          <label>Professional Bio</label>
          {isEditing ? (
            <textarea
              name="bio"
              className={styles.formControl}
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              required
            />
          ) : (
            <p className={styles.displayText}>
              {freelancer?.bio || "No biography provided."}
            </p>
          )}
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Hourly Rate ($)</label>
            {isEditing ? (
              <input
                type="number"
                name="hourlyRate"
                className={styles.formControl}
                value={formData.hourlyRate}
                onChange={handleChange}
                required
              />
            ) : (
              <p className={styles.displayText}>${freelancer?.hourlyRate}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Weekly Available Hours</label>
            {isEditing ? (
              <input
                type="number"
                name="availableHours"
                className={styles.formControl}
                value={formData.availableHours}
                onChange={handleChange}
                required
              />
            ) : (
              <p className={styles.displayText}>
                {freelancer?.availableHours} hours
              </p>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Experience Level</label>
          {isEditing ? (
            <select
              name="experienceLevel"
              className={styles.formControl}
              value={formData.experienceLevel}
              onChange={handleChange}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          ) : (
            <p className={styles.displayText}>
              {freelancer?.experienceLevel || "Not specified"}
            </p>
          )}
        </div>

        {/* Actions */}
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
