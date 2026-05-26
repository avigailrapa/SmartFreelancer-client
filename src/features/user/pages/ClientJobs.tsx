import { useState } from "react";
import { useGetMyJobsQuery, useDeleteJobMutation } from "../../job/redux/api";
import { JobProposals } from "../../proposal/components/JobProposals";
import { AddJobForm } from "../components/AddJobForm";
import styles from "./ClientJobs.module.scss";
import { RatingForm } from "../../rating/components/ratingForm";

export const ClientJobs = () => {
  const { data: myJobs, isLoading, isError, refetch } = useGetMyJobsQuery();
  const [deleteJob] = useDeleteJobMutation();

  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [ratingTarget, setRatingTarget] = useState<{ jobId: number; freelancerId: number } | null>(null);

  const handleJobAdded = () => {
    setShowAddForm(false);
    refetch();
  };

  const handleDelete = async (jobId: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    await deleteJob(jobId);
    refetch();
  };

  return (
    <div className={styles.myJobsSection}>
      <div className={styles.jobsHeader}>
        <h3>My Jobs</h3>
        <button className={styles.btnAddJob} onClick={() => setShowAddForm(true)}>
          + Add New Job
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong</p>}
      {!isLoading && myJobs?.length === 0 && <p>No jobs yet</p>}

      {myJobs?.map((job) => (
        <div key={job.jobId} className={styles.jobCard}>
          <div
            className={styles.jobHeader}
            onClick={() => setExpandedJob(expandedJob === job.jobId ? null : job.jobId)}
          >
            <h4>{job.title}</h4>
            <div className={styles.jobHeaderActions}>
              <span className={styles.expandIcon}>
                {expandedJob === job.jobId ? "▼" : "▶"}
              </span>
              <button
                className={styles.btnDeleteJob}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(job.jobId);
                }}
              >
                Delete
              </button>
            </div>
          </div>

          {/* ✨ שינוי מרכזי: הפרטים מוצגים רק בלחיצה (כשכרטיס זה מורחב) ✨ */}
          {expandedJob === job.jobId && (
            <div className={styles.jobDetails}>
              <p>{job.description}</p>
              <div className={styles.jobMeta}>
                <span>Budget: ${job.maxPayPerHour}/hr</span>
                <span>Status: {job.status}</span>
              </div>
            </div>
          )}

          {job.status === "Completed" && job.assignedFreelancerId && (
            <div className={styles.ratingSection}>
              <button
                className={styles.btnOpenRating}
                onClick={() => setRatingTarget({ jobId: job.jobId, freelancerId: job.assignedFreelancerId! })}
              >
                ⭐ Rate Freelancer
              </button>
            </div>
          )}

          {expandedJob === job.jobId && (
            <div className={styles.jobProposals}>
              <JobProposals jobId={job.jobId} />
            </div>
          )}
        </div>
      ))}

      {ratingTarget && (
        <div className={styles.modalOverlay} onClick={() => setRatingTarget(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <RatingForm
              freelancerId={ratingTarget.freelancerId}
              onClose={() => setRatingTarget(null)}
            />
          </div>
        </div>
      )}

      {showAddForm && (
        <AddJobForm
          onJobAdded={handleJobAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};