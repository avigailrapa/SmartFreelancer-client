import { useState } from "react";
import { useGetMyJobsQuery, useDeleteJobMutation } from "../../job/redux/api";
import { JobProposals } from "../../proposal/components/JobProposals";
import { AddJobForm } from "../components/AddJobForm";
import "../../proposal/components/ProposalStyles.css";
import "./ClientJobs.css";

export const ClientJobs = () => {
  const { data: myJobs, isLoading, isError, refetch } = useGetMyJobsQuery();
  const [deleteJob] = useDeleteJobMutation();
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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
    <div className="my-jobs-section">
      <div className="jobs-header">
        <h3>My Jobs</h3>
        <button className="btn-add-job" onClick={() => setShowAddForm(true)}>
          + Add New Job
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong</p>}
      {!isLoading && myJobs?.length === 0 && <p>No jobs yet</p>}

      {myJobs?.map((job) => (
        <div key={job.jobId} className="job-card">
          <div
            className="job-header"
            onClick={() =>
              setExpandedJob(expandedJob === job.jobId ? null : job.jobId)
            }
          >
            <h4>{job.title}</h4>
            <div className="job-header-actions">
              <span className="expand-icon">
                {expandedJob === job.jobId ? "▼" : "▶"}
              </span>
              <button
                className="btn-delete-job"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(job.jobId);
                }}
              >
                Delete
              </button>
            </div>
          </div>

          <div className="job-details">
            <p>{job.description}</p>
            <div className="job-meta">
              <span>Budget: ${job.maxPayPerHour}/hr</span>
              <span>
                Status:{" "}
                {job.status === "Open"
                  ? "Open"
                  : job.status === "InProgress"
                    ? "In Progress"
                    : "Completed"}
              </span>
            </div>
          </div>

          {expandedJob === job.jobId && (
            <div className="job-proposals">
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
