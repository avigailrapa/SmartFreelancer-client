import { useState, useEffect } from "react";
import {
  useUpdateFreelancerMutation,
  useGetFreelancerByIdQuery,
} from "../redux/api";
import styles from "./ProfilePage.module.scss";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";

export const ProfilePage = () => {
  const currentUser = useSelector((state: RootState) => state.user.user);

  const [updateFreelancer, { isLoading: isSaving }] =
    useUpdateFreelancerMutation();

  const { data: myProfile, isLoading } = useGetFreelancerByIdQuery(
    currentUser?.freelancerId ?? 0,
    { skip: !currentUser?.freelancerId },
  );

  const [bio, setBio] = useState(myProfile?.bio || "");
  const [hourlyRate, setHourlyRate] = useState(myProfile?.hourlyRate || 0);
  const [availableHours, setAvailableHours] = useState(
    myProfile?.availableHours || 0,
  );
  const [experienceLevel, setExperienceLevel] = useState(
    myProfile?.experienceLevel || "Junior",
  );
  useEffect(() => {
    if (myProfile) {
      setBio(myProfile.bio || "");
      setHourlyRate(myProfile.hourlyRate || 0);
      setAvailableHours(myProfile.availableHours || 0);
      setExperienceLevel(myProfile.experienceLevel || "Junior");
    }
  }, [myProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser?.freelancerId) return;

    try {
      await updateFreelancer({
        freelancerId: currentUser.freelancerId,
        bio,
        hourlyRate,
        availableHours,
        experienceLevel,
      }).unwrap();

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (isLoading)
    return <div className={styles.loading}>Loading profile...</div>;

  return (
    <div className={styles.profileContainer}>
      <header className={styles.profileHeader}>
        <h2>Account Profile</h2>
        <p>Manage your SkillBridge freelancer public profile settings</p>
      </header>

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.formGroup}>
          <label>Username</label>
          <input
            type="text"
            value={currentUser?.fullName || ""}
            disabled
            className={styles.disabledInput}
          />
          <small>Username cannot be changed</small>
        </div>

        <div className={styles.formGroup}>
          <label>Professional Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell clients about your skills and experience..."
            rows={4}
            required
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Hourly Rate ($)</label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              min="10"
              max="1500"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label> Available Hours</label>
            <input
              type="number"
              value={availableHours}
              onChange={(e) => setAvailableHours(Number(e.target.value))}
              min="0"
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Experience Level</label>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
          >
            <option value="Junior">Junior</option>
            <option value="MidLevel">Mid-Level</option>
            <option value="Senior">Senior</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.saveBtn} disabled={isSaving}>
            {isSaving ? "Saving Changes..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};
