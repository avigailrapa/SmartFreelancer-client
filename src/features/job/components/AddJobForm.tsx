import { useState, useMemo } from "react";
import { useCreateJobMutation } from "../redux/api";
import { useGetAllCategoriesQuery } from "../../category/redux/api";
import styles from "./AddJobForm.module.scss";

interface AddJobFormProps {
  onJobAdded: () => void;
  onCancel: () => void;
}

export const AddJobForm = ({ onJobAdded, onCancel }: AddJobFormProps) => {
  const [createJob, { isLoading, error }] = useCreateJobMutation();
  const { data: categories = [], isLoading: categoriesLoading } =
    useGetAllCategoriesQuery();

  const [formStep, setFormStep] = useState(1);

  const [form, setForm] = useState({
    title: "",
    description: "",
    requiredHours: 0,
    deadline: "",
    maxPayPerHour: 0,
    mainCategoryId: 0,
    specialtyCategoryId: 0, 
    requiredSkillIds: [] as number[],
  });

  const mainCategories = useMemo(
    () => categories.filter((c) => c.type === "Main"),
    [categories],
  );

  const availableSpecialties = useMemo(() => {
    const main = categories.find((c) => c.categoryId === form.mainCategoryId);
    return main?.subCategories || [];
  }, [categories, form.mainCategoryId]);

  const availableSkills = useMemo(() => {
    const spec = availableSpecialties.find(
      (s) => s.categoryId === form.specialtyCategoryId,
    );
    return spec?.subCategories || [];
  }, [availableSpecialties, form.specialtyCategoryId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "mainCategoryId") {
      setForm({
        ...form,
        mainCategoryId: parseInt(value) || 0,
        specialtyCategoryId: 0,
        requiredSkillIds: [],
      });
    } else if (name === "specialtyCategoryId") {
      setForm({
        ...form,
        specialtyCategoryId: parseInt(value) || 0,
        requiredSkillIds: [],
      });
    } else {
      setForm({
        ...form,
        [name]:
          name === "maxPayPerHour" || name === "requiredHours"
            ? parseFloat(value) || 0
            : value,
      });
    }
  };

  const handleToggleSkill = (id: number) => {
    setForm((prev) => ({
      ...prev,
      requiredSkillIds: prev.requiredSkillIds.includes(id)
        ? prev.requiredSkillIds.filter((s) => s !== id)
        : [...prev.requiredSkillIds, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      requiredHours: form.requiredHours,
      deadline: form.deadline,
      maxPayPerHour: form.maxPayPerHour,
      mainCategoryId: form.mainCategoryId,
      specialtyCategoryId: form.specialtyCategoryId,
      requiredSkillIds: form.requiredSkillIds,
    };

    try {
      await createJob(payload).unwrap();
      onJobAdded();
    } catch (err) {
      console.error("Failed to create job", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Create New Job</h3>
          <button type="button" className={styles.closeBtn} onClick={onCancel}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {formStep === 1 && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="title">Job Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="mainCategoryId">Category *</label>
                  <select
                    id="mainCategoryId"
                    name="mainCategoryId"
                    value={form.mainCategoryId}
                    onChange={handleChange}
                    required
                    disabled={categoriesLoading}
                  >
                    <option value="">
                      {categoriesLoading ? "Loading..." : "Select Category"}
                    </option>
                    {mainCategories.map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {form.mainCategoryId > 0 && (
                  <div className={styles.formGroup}>
                    <label htmlFor="specialtyCategoryId">Specialty *</label>
                    <select
                      id="specialtyCategoryId"
                      name="specialtyCategoryId"
                      value={form.specialtyCategoryId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Specialty</option>
                      {availableSpecialties.map((s) => (
                        <option key={s.categoryId} value={s.categoryId}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="requiredHours">Required Hours *</label>
                  <input
                    type="number"
                    id="requiredHours"
                    name="requiredHours"
                    value={form.requiredHours}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="maxPayPerHour">Budget (per hour) *</label>
                  <input
                    type="number"
                    id="maxPayPerHour"
                    name="maxPayPerHour"
                    value={form.maxPayPerHour}
                    onChange={handleChange}
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="deadline">Deadline *</label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.submitBtn}
                  disabled={!form.specialtyCategoryId}
                  onClick={() => setFormStep(2)}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {formStep === 2 && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.skillsLabel}>
                  Select Specific Skills (Optional)
                </label>
                {availableSkills.length > 0 ? (
                  <div className={styles.skillsCloud}>
                    {availableSkills.map((skill) => (
                      <button
                        key={skill.categoryId}
                        type="button"
                        className={`${styles.skillTag} ${form.requiredSkillIds.includes(skill.categoryId) ? styles.active : ""}`}
                        onClick={() => handleToggleSkill(skill.categoryId)}
                      >
                        {skill.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noSkillsMessage}>
                    No specific skills needed for this specialty. You can
                    proceed to save.
                  </p>
                )}
              </div>

              {error && (
                <div className={styles.errorMessage}>
                  {typeof error === "object" && "data" in error
                    ? (error.data as any)?.message || "Failed to create job"
                    : "Failed to create job"}
                </div>
              )}

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setFormStep(1)}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Job"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
