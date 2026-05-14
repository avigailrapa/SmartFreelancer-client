import { useState } from "react";
import { useGetMyJobsQuery } from "../../job/redux/api";
import { JobProposals } from "../../proposal/components/JobProposals";
import { AddJobForm } from "../components/AddJobForm";
import "../../proposal/components/ProposalStyles.css";
import "./ClientJobs.css";

export const ClientJobs = () => {
  const { data: myJobs, isLoading, isError, refetch } = useGetMyJobsQuery();
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleJobAdded = () => {
    setShowAddForm(false);
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
            <span className="expand-icon">
              {expandedJob === job.jobId ? "▼" : "▶"}
            </span>
          </div>

          <div className="job-details">
            <p>{job.description}</p>
            <div className="job-meta">
              <span>Budget: ${job.maxPayPerHour}/hr</span>
              <span>
                Status:{" "}
                {job.status === 0
                  ? "Open"
                  : job.status === 1
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
