import { useState, useMemo } from "react";
import { useCreateJobMutation } from "../../job/redux/api";
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

  const [form, setForm] = useState({
    title: "",
    description: "",
    requiredHours: 0,
    deadline: "",
    maxPayPerHour: 0,
    mainCategoryId: 0,
    requiredSkillIds: [] as number[],
  });

  const availableSkills = useMemo(() => {
    const main = categories.find((c) => c.categoryId === form.mainCategoryId);
    if (!main) return [];
    const all: { categoryId: number; name: string }[] = [];
    main.subCategories?.forEach((spec) => {
      all.push(spec);
      spec.subCategories?.forEach((skill) => all.push(skill));
    });
    return Array.from(new Map(all.map((s) => [s.categoryId, s])).values());
  }, [categories, form.mainCategoryId]);

  const mainCategories = useMemo(
    () => categories.filter((c) => c.type === "Main"),
    [categories],
  );

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
    try {
      await createJob(form).unwrap();
      setForm({
        title: "",
        description: "",
        requiredHours: 0,
        deadline: "",
        maxPayPerHour: 0,
        mainCategoryId: 0,
        requiredSkillIds: [],
      });
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
          <button className={styles.closeBtn} onClick={onCancel}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Job Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g., Build React Dashboard"
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
              placeholder="Describe what you need to be done..."
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
                  {categoriesLoading ? "Loading..." : "Select a category"}
                </option>
                {mainCategories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="requiredHours">Required Hours *</label>
              <input
                type="number"
                id="requiredHours"
                name="requiredHours"
                placeholder="Hours needed"
                value={form.requiredHours}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          {form.mainCategoryId > 0 && (
            <div className={styles.formGroup}>
              <label>Required Skills</label>
              <div className={styles.skillsCloud}>
                {availableSkills.map((skill) => (
                  <button
                    key={skill.categoryId}
                    type="button"
                    className={`${styles.skillTag} ${
                      form.requiredSkillIds.includes(skill.categoryId)
                        ? styles.active
                        : ""
                    }`}
                    onClick={() => handleToggleSkill(skill.categoryId)}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="maxPayPerHour">Budget (per hour) *</label>
              <input
                type="number"
                id="maxPayPerHour"
                name="maxPayPerHour"
                placeholder="$"
                value={form.maxPayPerHour}
                onChange={handleChange}
                min="1"
                step="0.01"
                required
              />
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
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
