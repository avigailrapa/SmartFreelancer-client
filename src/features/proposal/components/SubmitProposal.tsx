import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { useSubmitProposalMutation } from "../redux/api";
import type { Job } from "../../../types/job";
import "./ProposalStyles.css";

interface SubmitProposalProps {
  job: Job;
  onClose: () => void;
}

export const SubmitProposal = ({ job, onClose }: SubmitProposalProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [submitProposal, { isLoading }] = useSubmitProposalMutation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    hourlyRate: job.maxPayPerHour || 0,
    estimatedHours: job.requiredHours || 0,
    message: "",
    proposalDuration: 3, // days to deliver
  });

  const totalEstimatedPrice = formData.hourlyRate * formData.estimatedHours;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (formData.hourlyRate < 1 || formData.hourlyRate > job.maxPayPerHour) {
      newErrors.hourlyRate = `Rate must be between $1 and $${job.maxPayPerHour}`;
    }

    if (formData.estimatedHours < 1) {
      newErrors.estimatedHours = "Estimated hours must be at least 1";
    }

    if (formData.message.length < 20) {
      newErrors.message = "Cover message must be at least 20 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!user?.freelancerId) {
      alert("You must be a freelancer to submit proposals");
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
      alert(`Error: ${err.data?.message || "Something went wrong"}`);
    }
  };

  return (
    <div className="proposal-modal-overlay" onClick={onClose}>
      <div
        className="proposal-modal-fiverr"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="proposal-modal-header">
          <div className="proposal-header-left">
            <h2>Send a proposal</h2>
            <p className="proposal-header-subtitle">
              Stand out by personalizing your proposal
            </p>
          </div>
          <button className="proposal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Divider */}
        <div className="proposal-divider"></div>

        {/* Job Info Card */}
        <div className="proposal-job-card">
          <div className="job-card-left">
            <p className="job-card-label">Job Title</p>
            <h3 className="job-card-title">{job.title}</h3>
            <p className="job-card-description">
              {job.description?.substring(0, 100)}...
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="proposal-form-fiverr">
          {/* Budget Section */}
          <div className="proposal-section">
            <h4 className="section-title">💰 Proposal Budget</h4>

            <div className="proposal-form-row">
              <div className="proposal-form-group">
                <label>Hourly Rate</label>
                <div className="input-wrapper">
                  <span className="currency-prefix">$</span>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        hourlyRate: value,
                      }));
                      setErrors((prev) => ({
                        ...prev,
                        hourlyRate: "",
                      }));
                    }}
                    min="1"
                    max={job.maxPayPerHour}
                    className={errors.hourlyRate ? "input-error" : ""}
                  />
                </div>
                <small className="input-hint">
                  Max: ${job.maxPayPerHour}/hr
                </small>
                {errors.hourlyRate && (
                  <span className="error-message">{errors.hourlyRate}</span>
                )}
              </div>

              <div className="proposal-form-group">
                <label>Estimated Hours</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="estimatedHours"
                    value={formData.estimatedHours}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        estimatedHours: value,
                      }));
                      setErrors((prev) => ({
                        ...prev,
                        estimatedHours: "",
                      }));
                    }}
                    min="1"
                    className={errors.estimatedHours ? "input-error" : ""}
                  />
                  <span className="currency-suffix">hrs</span>
                </div>
                <small className="input-hint">
                  Required: {job.requiredHours} hrs
                </small>
                {errors.estimatedHours && (
                  <span className="error-message">{errors.estimatedHours}</span>
                )}
              </div>

              <div className="proposal-form-group">
                <label>Delivery Time</label>
                <div className="input-wrapper">
                  <select
                    name="proposalDuration"
                    value={formData.proposalDuration}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        proposalDuration: Number(e.target.value),
                      }));
                    }}
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

          {/* Price Breakdown */}
          <div className="price-breakdown">
            <div className="price-row">
              <span>Hourly rate:</span>
              <span>${formData.hourlyRate.toFixed(2)}/hr</span>
            </div>
            <div className="price-row">
              <span>Estimated hours:</span>
              <span>{formData.estimatedHours} hrs</span>
            </div>
            <div className="price-row-total">
              <span>Total Price:</span>
              <span className="total-amount">
                ${totalEstimatedPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Message Section */}
          <div className="proposal-section">
            <h4 className="section-title">📝 Cover Letter</h4>

            <div className="proposal-form-group full-width">
              <label>Why are you the best fit for this job?</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }));
                  setErrors((prev) => ({
                    ...prev,
                    message: "",
                  }));
                }}
                placeholder="Introduce yourself, explain your experience, and why you're the perfect fit for this project..."
                rows={5}
                className={errors.message ? "input-error" : ""}
              />
              <div className="textarea-footer">
                <span
                  className={`char-count ${formData.message.length < 20 ? "warning" : ""}`}
                >
                  {formData.message.length}/20 characters minimum
                </span>
              </div>
              {errors.message && (
                <span className="error-message">{errors.message}</span>
              )}
            </div>
          </div>

          {/* Tips Box */}
          <div className="proposal-tips-box">
            <p className="tips-title">💡 Tips for a strong proposal:</p>
            <ul className="tips-list">
              <li>
                Be specific about your experience and previous similar work
              </li>
              <li>Respond to the client's specific requirements</li>
              <li>Keep your message professional and concise</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="proposal-modal-footer">
            <button
              type="button"
              className="proposal-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="proposal-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
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
