import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import {
  useGetFreelancerByIdQuery,
  useUpdateFreelancerMutation,
} from "../redux/api";
import type { Freelancer } from "../../../types/freelancer";
import "./Dashboard.css";

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

  if (isLoading) return <div className="loading">Loading Profile...</div>;
  if (isError) return <div className="error">Error loading profile data.</div>;

  return (
    <div className="card">
      <div className="profile-header">
        <h1>Professional Profile</h1>
        <p>
          Welcome, {freelancer?.userName || "freelancer"}. Manage your
          professional settings here.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Name</label>
          {isEditing ? (
            <input
              type="text"
              name="userName"
              className="form-control"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          ) : (
            <p className="display-text">
              {freelancer?.userName || "No name set"}
            </p>
          )}
        </div>

        {/* Bio Section */}
        <div className="form-group">
          <label>Professional Bio</label>
          {isEditing ? (
            <textarea
              name="bio"
              className="form-control"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              required
            />
          ) : (
            <p className="display-text">
              {freelancer?.bio || "No biography provided."}
            </p>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Hourly Rate ($)</label>
            {isEditing ? (
              <input
                type="number"
                name="hourlyRate"
                className="form-control"
                value={formData.hourlyRate}
                onChange={handleChange}
                required
              />
            ) : (
              <p className="display-text">${freelancer?.hourlyRate}</p>
            )}
          </div>

          <div className="form-group">
            <label>Weekly Available Hours</label>
            {isEditing ? (
              <input
                type="number"
                name="availableHours"
                className="form-control"
                value={formData.availableHours}
                onChange={handleChange}
                required
              />
            ) : (
              <p className="display-text">{freelancer?.availableHours} hours</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Experience Level</label>
          {isEditing ? (
            <select
              name="experienceLevel"
              className="form-control"
              value={formData.experienceLevel}
              onChange={handleChange}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          ) : (
            <p className="display-text">
              {freelancer?.experienceLevel || "Not specified"}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="actions-footer">
          {!isEditing ? (
            <button
              type="button"
              className="btn-primary"
              onClick={handleStartEdit}
            >
              Edit Profile
            </button>
          ) : (
            <div className="button-group">
              <button
                type="submit"
                className="btn-primary"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn-cancel"
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
