import { useState, useMemo } from "react";
import { useGetAllCategoriesQuery } from "../../category/redux/api";
import { useBecomeFreelancerMutation } from "../redux/api";
import { useNavigate } from "react-router-dom";
import "./BecomeFreelancer.css";

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
    availableHours: "",
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
    const skills: any[] = [];
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
    data.append("AvailableHours", formData.availableHours);
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
    <div className="become-freelancer-page">
      <div className="wizard-container">
        <div className="wizard-stepper">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`step-item ${step >= s ? "active" : ""}`}>
              <div className="step-number">{s}</div>
            </div>
          ))}
        </div>

        <div className="wizard-card">
          {step === 1 && (
            <div className="step-content">
              <h2>Personal Information</h2>
              <div className="image-section">
                <div className="avatar-preview">
                  {imagePreview ? <img src={imagePreview} /> : "📷"}
                </div>
                <input
                  type="file"
                  id="img"
                  hidden
                  onChange={handleImageChange}
                />
                <label htmlFor="img" className="upload-btn">
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
                <div className="form-group">
                  <label>Hours/Week</label>
                  <input
                    type="number"
                    value={formData.availableHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availableHours: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <button
                className="primary-btn"
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
              <div className="category-grid">
                {mainCategories.map((cat) => (
                  <div
                    key={cat.categoryId}
                    className={`category-card ${formData.mainCategoryId === cat.categoryId ? "selected" : ""}`}
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
              <div className="actions">
                <button className="secondary-btn" onClick={() => setStep(1)}>
                  Back
                </button>
                <button
                  className="primary-btn"
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
              <div className="actions">
                <button className="secondary-btn" onClick={() => setStep(2)}>
                  Back
                </button>
                <button
                  className="primary-btn"
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
              <div className="skills-cloud">
                {availableSkills.map((skill) => (
                  <button
                    key={skill.categoryId}
                    className={`skill-tag ${formData.selectedSkills.includes(skill.categoryId) ? "active" : ""}`}
                    onClick={() => handleToggleSkill(skill.categoryId)}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
              <div className="actions">
                <button className="secondary-btn" onClick={() => setStep(3)}>
                  Back
                </button>
                <button
                  className="primary-btn submit"
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
