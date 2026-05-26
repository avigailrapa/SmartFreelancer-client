import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import {
  useGetFreelancerByIdQuery,
  useUpdateFreelancerMutation,
} from "../redux/api";
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
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    bio: "",
    hourlyRate: 0,
    availableHours: 0,
    availableUntil: "",
    experienceLevel: "",
  });

  useEffect(() => {
    if (freelancer) {
      setFormData({
        bio: freelancer.bio || "",
        hourlyRate: freelancer.hourlyRate || 0,
        availableHours: freelancer.availableHours || 0,
        availableUntil: freelancer.availableUntil
          ? freelancer.availableUntil.split("T")[0]
          : "",
        experienceLevel: freelancer.experienceLevel || "",
      });
    }
  }, [freelancer]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleStartEdit = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (freelancer) {
      setFormData({
        bio: freelancer.bio,
        hourlyRate: freelancer.hourlyRate,
        availableHours: freelancer.availableHours,
        availableUntil: freelancer.availableUntil
          ? freelancer.availableUntil.split("T")[0]
          : "",
        experienceLevel: freelancer.experienceLevel,
      });
    }
    setSuccessMsg(null);
    setErrorMsg(null);
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    const numericFields = ["hourlyRate", "availableHours"];
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!freelancer) return;

    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await updateFreelancer({
        ...freelancer,
        bio: formData.bio,
        hourlyRate: formData.hourlyRate,
        experienceLevel: formData.experienceLevel,
        availableHours: formData.availableHours,
        availableUntil: formData.availableUntil
          ? new Date(formData.availableUntil).toISOString()
          : freelancer.availableUntil,
        latestRating: undefined,
      }).unwrap();

      setIsEditing(false);
      setSuccessMsg("Profile updated successfully!");
    } catch (err: any) {
      setErrorMsg(err?.data?.detail || "Update failed. Please try again.");
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

      {successMsg && <div className={styles.alertSuccess}>{successMsg}</div>}
      {errorMsg && <div className={styles.alertError}>{errorMsg}</div>}

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <p className={styles.displayText}>
            {freelancer?.userName || "No name set"}
          </p>
        </div>

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
            <label>Available Hours</label>
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
          <label>Availability Valid Until</label>
          {isEditing ? (
            <input
              type="date"
              name="availableUntil"
              className={styles.formControl}
              min={new Date().toISOString().split("T")[0]}
              value={formData.availableUntil}
              onChange={handleChange}
              required
            />
          ) : (
            <p className={styles.displayText}>
              {freelancer?.availableUntil
                ? new Date(freelancer.availableUntil).toLocaleDateString(
                    "he-IL",
                  )
                : "No date specified"}
            </p>
          )}
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
              <option value="Junior">Junior</option>
              <option value="MidLevel">Mid Level</option>
              <option value="Senior">Senior</option>
              <option value="Expert">Expert</option>
            </select>
          ) : (
            <p className={styles.displayText}>
              {freelancer?.experienceLevel || "Not specified"}
            </p>
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
