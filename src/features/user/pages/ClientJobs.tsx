import { useState } from "react";
import { useGetMyJobsQuery, useDeleteJobMutation } from "../../job/redux/api";
import { useAddRatingMutation } from "../../rating/redux/api";
import { JobProposals } from "../../proposal/components/JobProposals";
import { AddJobForm } from "../components/AddJobForm";
import styles from "./ClientJobs.module.scss";

export const ClientJobs = () => {
  const { data: myJobs, isLoading, isError, refetch } = useGetMyJobsQuery();
  const [deleteJob] = useDeleteJobMutation();
  const [addRating] = useAddRatingMutation(); // המוטציה לשליחת דירוג

  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // מצב לניהול הדירוג (באיזו עבודה אנחנו מדרגים כרגע)
  const [ratingJobId, setRatingJobId] = useState<number | null>(null);
  const [ratingData, setRatingData] = useState({ stars: 5, comment: "" });

  const handleRatingSubmit = async (freelancerId: number) => {
    try {
      await addRating({
        freelancerId,
        stars: ratingData.stars,
        comment: ratingData.comment,
      }).unwrap();

      alert("Rating submitted successfully!");
      setRatingJobId(null); 
      setRatingData({ stars: 5, comment: "" }); 
    } catch (err) {
      alert(
        "Failed to submit rating. Maybe you already rated this freelancer?",
      );
    }
  };

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

        <button
          className={styles.btnAddJob}
          onClick={() => setShowAddForm(true)}
        >
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
            onClick={() =>
              setExpandedJob(expandedJob === job.jobId ? null : job.jobId)
            }
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

          <div className={styles.jobDetails}>
            <p>{job.description}</p>

            <div className={styles.jobMeta}>
              <span>Budget: ${job.maxPayPerHour}/hr</span>
              <span>Status:{job.status}</span>
            </div>
          </div>
          {job.status === "Completed" && job.assignedFreelancerId && (
            <div className={styles.ratingSection}>
              {ratingJobId === job.jobId ? (
                <div className={styles.ratingForm}>
                  <select
                    value={ratingData.stars}
                    onChange={(e) =>
                      setRatingData({
                        ...ratingData,
                        stars: Number(e.target.value),
                      })
                    }
                  >
                    {[5, 4, 3, 2, 1].map((num) => (
                      <option key={num} value={num}>
                        {num} Stars
                      </option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Write a comment about the freelancer..."
                    value={ratingData.comment}
                    onChange={(e) =>
                      setRatingData({ ...ratingData, comment: e.target.value })
                    }
                  />
                  <div className={styles.ratingBtns}>
                    <button
                      onClick={() => handleRatingSubmit(job.assignedFreelancerId!)}
                      className={styles.btnSubmitRating}
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setRatingJobId(null)}
                      className={styles.btnCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className={styles.btnOpenRating}
                  onClick={() => setRatingJobId(job.jobId)}
                >
                  ⭐ Rate Freelancer
                </button>
              )}
            </div>
          )}

          {expandedJob === job.jobId && (
            <div className={styles.jobProposals}>
              <JobProposals jobId={job.jobId} />
            </div>
          )}
        </div>
      ))}

      {showAddForm && (
        <AddJobForm
          onJobAdded={handleJobAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};
