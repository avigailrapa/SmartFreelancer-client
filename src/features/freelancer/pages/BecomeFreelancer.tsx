import { useState, useMemo } from "react";
import { useGetAllCategoriesQuery } from "../../category/redux/api";
import { useBecomeFreelancerMutation } from "../redux/api";
import { useNavigate } from "react-router-dom";
import styles from "./BecomeFreelancer.module.scss";
import type { Category } from "../../../types/category";

export const BecomeFreelancer = () => {
  const navigate = useNavigate();
  const { data: categories = [], isLoading: categoriesLoading } =
    useGetAllCategoriesQuery();
  const [becomeFreelancer, { isLoading: isSubmitting }] =
    useBecomeFreelancerMutation();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    userName: "",
    bio: "",
    hourlyRate: "",
    experienceLevel: "Junior",
    imageFile: null as File | null,
    mainCategoryId: null as number | null,
    selectedSpecs: [] as number[],
    selectedSkills: [] as number[],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const mainCategories = useMemo(
    () => categories.filter((c) => c.type === "Main"),
    [categories],
  );

  const availableSpecialties = useMemo(() => {
    const main = categories.find(
      (c) => c.categoryId === formData.mainCategoryId,
    );
    return main?.subCategories || [];
  }, [categories, formData.mainCategoryId]);

  const availableSkills = useMemo(() => {
    const skills: Category[] = [];
    formData.selectedSpecs.forEach((specId) => {
      const spec = availableSpecialties.find((s) => s.categoryId === specId);
      if (spec?.subCategories) skills.push(...spec.subCategories);
    });
    return Array.from(new Map(skills.map((s) => [s.categoryId, s])).values());
  }, [availableSpecialties, formData.selectedSpecs]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleToggleSpec = (id: number) => {
    setFormData((prev) => {
      if (prev.selectedSpecs.includes(id)) {
        const specToRemove = availableSpecialties.find(
          (s) => s.categoryId === id,
        );
        const skillsToRemove =
          specToRemove?.subCategories.map((sk) => sk.categoryId) || [];
        return {
          ...prev,
          selectedSpecs: prev.selectedSpecs.filter((s) => s !== id),
          selectedSkills: prev.selectedSkills.filter(
            (skId) => !skillsToRemove.includes(skId),
          ),
        };
      }
      if (prev.selectedSpecs.length >= 3) return prev;
      return { ...prev, selectedSpecs: [...prev.selectedSpecs, id] };
    });
  };

  const handleToggleSkill = (id: number) => {
    setFormData((prev) => {
      if (prev.selectedSkills.includes(id)) {
        return {
          ...prev,
          selectedSkills: prev.selectedSkills.filter((s) => s !== id),
        };
      }
      if (prev.selectedSkills.length >= 15) return prev;
      return { ...prev, selectedSkills: [...prev.selectedSkills, id] };
    });
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("UserName", formData.userName);
    data.append("Bio", formData.bio);
    data.append("HourlyRate", formData.hourlyRate);
    data.append("ExperienceLevel", formData.experienceLevel);

    if (formData.mainCategoryId)
      data.append("MainCategoryId", formData.mainCategoryId.toString());
    if (formData.imageFile) data.append("ImageFile", formData.imageFile);

    formData.selectedSpecs.forEach((id) =>
      data.append("SpecializationIds", id.toString()),
    );
    formData.selectedSkills.forEach((id) =>
      data.append("SkillIds", id.toString()),
    );

    try {
      await becomeFreelancer(data).unwrap();
      alert("Profile created successfully!");
      navigate("/freelancer-dashboard");
    } catch (err: any) {
      alert(`Error: ${err?.data?.message || "Something went wrong"}`);
    }
  };

  if (categoriesLoading) return <div className="loader">Loading...</div>;

  return (
    <div className={styles.becomeFreelancerPage}>
      <div className={styles.wizardContainer}>
        <div className={styles.wizardStepper}>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`${styles.stepItem} ${step >= s ? styles.active : ""}`}
            >
              <div className="step-number">{s}</div>
            </div>
          ))}
        </div>

        <div className={styles.wizardCard}>
          {step === 1 && (
            <div className="step-content">
              <h2>Personal Information</h2>
              <div className="image-section">
                <div className={styles.avatarPreview}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" />
                  ) : (
                    "📷"
                  )}
                </div>
                <input
                  type="file"
                  id="img"
                  hidden
                  onChange={handleImageChange}
                />
                <label htmlFor="img" className={styles.uploadBtn}>
                  Upload Photo
                </label>
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label>Experience Level</label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experienceLevel: e.target.value,
                    })
                  }
                >
                  <option value="Junior">Junior</option>
                  <option value="MidLevel">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Describe your skills..."
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Hourly Rate ($)</label>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) =>
                      setFormData({ ...formData, hourlyRate: e.target.value })
                    }
                  />
                </div>
                <div className="form-group"></div>
              </div>
              <button
                className={styles.primaryBtn}
                disabled={
                  !formData.userName || !formData.bio || !formData.hourlyRate
                }
                onClick={() => setStep(2)}
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h2>What is your main field?</h2>
              <div className={styles.categoryGrid}>
                {mainCategories.map((cat) => (
                  <div
                    key={cat.categoryId}
                    className={`${styles.categoryCard} ${formData.mainCategoryId === cat.categoryId ? styles.selected : ""}`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        mainCategoryId: cat.categoryId,
                        selectedSpecs: [],
                        selectedSkills: [],
                      })
                    }
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button
                  className={styles.primaryBtn}
                  disabled={!formData.mainCategoryId}
                  onClick={() => setStep(3)}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h2>Select up to 3 Specialties</h2>
              <div className="checkbox-list">
                {availableSpecialties.map((spec) => (
                  <label key={spec.categoryId} className="check-item">
                    <input
                      type="checkbox"
                      checked={formData.selectedSpecs.includes(spec.categoryId)}
                      onChange={() => handleToggleSpec(spec.categoryId)}
                      disabled={
                        !formData.selectedSpecs.includes(spec.categoryId) &&
                        formData.selectedSpecs.length >= 3
                      }
                    />
                    {spec.name}
                  </label>
                ))}
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => setStep(2)}
                >
                  Back
                </button>
                <button
                  className={styles.primaryBtn}
                  disabled={formData.selectedSpecs.length === 0}
                  onClick={() => setStep(4)}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-content">
              <h2>Add Specific Skills (Max 15)</h2>

              {availableSkills.length > 0 ? (
                <div className={styles.skillsCloud}>
                  {availableSkills.map((skill) => (
                    <button
                      key={skill.categoryId}
                      className={`${styles.skillTag} ${formData.selectedSkills.includes(skill.categoryId) ? styles.active : ""}`}
                      onClick={() => handleToggleSkill(skill.categoryId)}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className={styles.noSkillsMessage}>
                  No specific skills found for your selected specialties. You're
                  good to go!
                </p>
              )}

              <div className={styles.actions}>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => setStep(3)}
                >
                  Back
                </button>
                <button
                  className={`${styles.primaryBtn} submit`}
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? "Saving..." : "Finish"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
