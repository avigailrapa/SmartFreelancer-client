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

  const [formData, setFormData] = useState({
    hourlyRate: job.maxPayPerHour || 0,
    estimatedHours: job.requiredHours || 0,
    message: "",
  });

  const totalEstimatedPrice = formData.hourlyRate * formData.estimatedHours;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.freelancerId) {
      alert("You must be a freelancer to submit proposals");
      return;
    }

    try {
      await submitProposal({
        jobId: job.jobId,
        hourlyRate: formData.hourlyRate,
        estimatedHours: formData.estimatedHours,
        totalEstimatedPrice,
        message: formData.message,
      }).unwrap();

      alert("Proposal submitted successfully!");
      onClose();
    } catch (err: any) {
      alert(`Error: ${err.data?.message || "Something went wrong"}`);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "hourlyRate" || name === "estimatedHours"
          ? Number(value)
          : value,
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Submit Proposal</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="proposal-form">
          <div className="form-group">
            <label>Job Title</label>
            <p className="job-title">{job.title}</p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Your Hourly Rate ($)</label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                min="1"
                max={job.maxPayPerHour}
                required
              />
              <small>Max: ${job.maxPayPerHour}</small>
            </div>

            <div className="form-group">
              <label>Estimated Hours</label>
              <input
                type="number"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Total Estimated Price</label>
            <p className="total-price">${totalEstimatedPrice.toFixed(2)}</p>
          </div>

          <div className="form-group">
            <label>Cover Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Introduce yourself and explain why you're the right fit for this job..."
              rows={6}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Proposal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
