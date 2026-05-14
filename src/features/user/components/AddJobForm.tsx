import { useState, useMemo } from "react";
import { useCreateJobMutation } from "../../job/redux/api";
import { useGetAllCategoriesQuery } from "../../category/redux/api";
import "./AddJobForm.css";

interface AddJobFormProps {
  onJobAdded: () => void;
  onCancel: () => void;
}

export const AddJobForm = ({ onJobAdded, onCancel }: AddJobFormProps) => {
  const [createJob, { isLoading, error }] = useCreateJobMutation();
  const { data: categories = [], isLoading: categoriesLoading } = useGetAllCategoriesQuery();

  const [form, setForm] = useState({
    title: "",
    description: "",
    requiredHours: 0,
    deadline: "",
    maxPayPerHour: 0,
    mainCategoryId: 0,
    requiredSkillIds: [] as number[],
  });

  // כל ה-skills וה-specializations של הקטגוריה הנבחרת ביחד
  const availableSkills = useMemo(() => {
    const main = categories.find((c) => c.categoryId === form.mainCategoryId);
    if (!main) return [];

    const all: { categoryId: number; name: string }[] = [];
    main.subCategories?.forEach((spec) => {
      all.push(spec); // specialization
      spec.subCategories?.forEach((skill) => {
        all.push(skill); // skill
      });
    });
    return Array.from(new Map(all.map((s) => [s.categoryId, s])).values());
  }, [categories, form.mainCategoryId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "mainCategoryId") {
      setForm({ ...form, mainCategoryId: parseInt(value) || 0, requiredSkillIds: [] });
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

  const mainCategories = useMemo(() => categories.filter((c) => c.type === "Main"), [categories]);

  return (
    <div className="add-job-form-container">
      <div className="add-job-modal">
        <div className="form-header">
          <h3>Create New Job</h3>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="add-job-form">
          <div className="form-group">
            <label htmlFor="title">Job Title *</label>
            <input type="text" id="title" name="title" className="form-input"
              placeholder="e.g., Build React Dashboard"
              value={form.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea id="description" name="description" className="form-textarea"
              placeholder="Describe what you need to be done..."
              value={form.description} onChange={handleChange} rows={4} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mainCategoryId">Category *</label>
              <select id="mainCategoryId" name="mainCategoryId" className="form-select"
                value={form.mainCategoryId} onChange={handleChange} required disabled={categoriesLoading}>
                <option value="">{categoriesLoading ? "Loading..." : "Select a category"}</option>
                {mainCategories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="requiredHours">Required Hours *</label>
              <input type="number" id="requiredHours" name="requiredHours" className="form-input"
                placeholder="Hours needed" value={form.requiredHours}
                onChange={handleChange} min="1" required />
            </div>
          </div>

          {/* Skills - מופיע רק אחרי בחירת קטגוריה */}
          {form.mainCategoryId > 0 && (
            <div className="form-group">
              <label>Required Skills</label>
              <div className="skills-cloud">
                {availableSkills.map((skill) => (
                  <button
                    key={skill.categoryId}
                    type="button"
                    className={`skill-tag ${form.requiredSkillIds.includes(skill.categoryId) ? "active" : ""}`}
                    onClick={() => handleToggleSkill(skill.categoryId)}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="maxPayPerHour">Budget (per hour) *</label>
              <input type="number" id="maxPayPerHour" name="maxPayPerHour" className="form-input"
                placeholder="$" value={form.maxPayPerHour}
                onChange={handleChange} min="1" step="0.01" required />
            </div>

            <div className="form-group">
              <label htmlFor="deadline">Deadline *</label>
              <input type="date" id="deadline" name="deadline" className="form-input"
                value={form.deadline} onChange={handleChange} required />
            </div>
          </div>

          {error && (
            <div className="error-message">
              {typeof error === "object" && "data" in error
                ? (error.data as any)?.message || "Failed to create job"
                : "Failed to create job"}
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};