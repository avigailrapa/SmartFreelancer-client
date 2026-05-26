import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { useSubmitProposalMutation } from "../redux/api";
import type { Job } from "../../../types/job";
import styles from "./ProposalStyles.module.scss";

interface SubmitProposalProps {
  job: Job;
  onClose: () => void;
}

export const SubmitProposal = ({ job, onClose }: SubmitProposalProps) => {
  // מושכים את המשתמש ואת מצב המכירה/קנייה הפעיל מה-Redux
  const { user, isSellingMode } = useSelector((state: RootState) => state.user);
  const [submitProposal, { isLoading }] = useSubmitProposalMutation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    hourlyRate: job.maxPayPerHour || 0,
    estimatedHours: job.requiredHours || 0,
    message: "",
    proposalDuration: 3,
  });

  const totalEstimatedPrice = formData.hourlyRate * formData.estimatedHours;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // ולידציה של השדות בטופס
    if (formData.hourlyRate < 1 || formData.hourlyRate > job.maxPayPerHour)
      newErrors.hourlyRate = `Rate must be between $1 and $${job.maxPayPerHour}`;
    if (formData.estimatedHours < 1)
      newErrors.estimatedHours = "Estimated hours must be at least 1";
    if (formData.message.length < 20)
      newErrors.message = "Cover message must be at least 20 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 🛑 1. חסימה במידה והמשתמש אינו מחובר, או אינו במצב פרילנסר פעיל (Selling Mode)
    if (!user || !isSellingMode || !user.freelancerId) {
      alert("You must be in Freelancer mode to submit proposals");
      return;
    }


    try {
      await submitProposal({
        jobId: job.jobId,
        hourlyRate: formData.hourlyRate,
        estimatedHours: formData.estimatedHours,
        message: formData.message,
      }).unwrap();
      alert("Proposal submitted successfully!");
      onClose();
    } catch (err: any) {
      alert(err?.data?.detail || err?.data?.message || err?.data?.title || "An error occurred");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2>Send a proposal</h2>
            <p className={styles.headerSubtitle}>
              Stand out by personalizing your proposal
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.jobCard}>
          <p className={styles.jobCardLabel}>Job Title</p>
          <h3 className={styles.jobCardTitle}>{job.title}</h3>
          <p className={styles.jobCardDescription}>
            {job.description?.substring(0, 100)}...
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Proposal Budget</h4>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Hourly Rate</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.currencyPrefix}>$</span>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => {
                      setFormData((p) => ({
                        ...p,
                        hourlyRate: Number(e.target.value),
                      }));
                      setErrors((p) => ({ ...p, hourlyRate: "" }));
                    }}
                    min="1"
                    max={job.maxPayPerHour}
                    className={errors.hourlyRate ? styles.inputError : ""}
                  />
                </div>
                <small className={styles.inputHint}>
                  Max: ${job.maxPayPerHour}/hr
                </small>
                {errors.hourlyRate && (
                  <span className={styles.errorMessage}>
                    {errors.hourlyRate}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Estimated Hours</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => {
                      setFormData((p) => ({
                        ...p,
                        estimatedHours: Number(e.target.value),
                      }));
                      setErrors((p) => ({ ...p, estimatedHours: "" }));
                    }}
                    min="1"
                    className={errors.estimatedHours ? styles.inputError : ""}
                  />
                  <span className={styles.currencySuffix}>hrs</span>
                </div>
                <small className={styles.inputHint}>
                  Required: {job.requiredHours} hrs
                </small>
                {errors.estimatedHours && (
                  <span className={styles.errorMessage}>
                    {errors.estimatedHours}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Delivery Time</label>
                <div className={styles.inputWrapper}>
                  <select
                    value={formData.proposalDuration}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        proposalDuration: Number(e.target.value),
                      }))
                    }
                  >
                    <option value={1}>1 day</option>
                    <option value={3}>3 days</option>
                    <option value={7}>1 week</option>
                    <option value={14}>2 weeks</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.priceBreakdown}>
            <div className={styles.priceRow}>
              <span>Hourly rate:</span>
              <span>${formData.hourlyRate.toFixed(2)}/hr</span>
            </div>
            <div className={styles.priceRow}>
              <span>Estimated hours:</span>
              <span>{formData.estimatedHours} hrs</span>
            </div>
            <div className={styles.priceRowTotal}>
              <span>Total Price:</span>
              <span className={styles.totalAmount}>
                ${totalEstimatedPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Cover Letter</h4>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Why are you the best fit for this job?</label>
              <textarea
                value={formData.message}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, message: e.target.value }));
                  setErrors((p) => ({ ...p, message: "" }));
                }}
                placeholder="Introduce yourself, explain your experience, and why you're the perfect fit..."
                rows={5}
                className={errors.message ? styles.inputError : ""}
              />
              <div className={styles.textareaFooter}>
                <span
                  className={`${styles.charCount} ${formData.message.length < 20 ? styles.warning : ""}`}
                >
                  {formData.message.length}/20 characters minimum
                </span>
              </div>
              {errors.message && (
                <span className={styles.errorMessage}>{errors.message}</span>
              )}
            </div>
          </div>

          <div className={styles.tipsBox}>
            <p className={styles.tipsTitle}>Tips for a strong proposal:</p>
            <ul className={styles.tipsList}>
              <li>
                Be specific about your experience and previous similar work
              </li>
              <li>Respond to the client's specific requirements</li>
              <li>Keep your message professional and concise</li>
            </ul>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner} />
                  Submitting...
                </>
              ) : (
                <>Send Proposal • ${totalEstimatedPrice.toFixed(2)}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

