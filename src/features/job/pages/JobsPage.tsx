import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { useGetOpenJobsQuery } from "../redux/api";
import { SubmitProposal } from "../../proposal/components/SubmitProposal";
import type { Job } from "../../../types/job";
import "./JobsPages.css";

export const JobsPage = () => {
  const { data: jobs, isLoading, error } = useGetOpenJobsQuery();
  const user = useSelector((state: RootState) => state.user.user);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  if (isLoading)
    return <div className="fvr-loader">Searching for opportunities...</div>;
  if (error)
    return (
      <div className="fvr-error">We encountered an issue loading the jobs.</div>
    );

  return (
    <div className="fvr-wrapper">
      <header className="fvr-header">
        <h1>Explore Open Projects</h1>
        <p>Work with talented clients on exciting new challenges</p>
      </header>

      <div className="fvr-grid">
        {jobs?.map((job: Job) => (
          <div key={job.jobId} className="fvr-card">
            <div className="fvr-card-top">
              <div className="fvr-avatar">
                {job.clientName?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="fvr-client-info">
                <span className="fvr-client-name">
                  {job.clientName ?? "Unknown"}
                </span>
              </div>
            </div>

            <div className="fvr-card-body">
              <h3 className="fvr-job-title">{job.title}</h3>
              <p className="fvr-job-desc">
                {(job.description ?? "").length > 120
                  ? `${job.description.substring(0, 120)}...`
                  : job.description}
              </p>
              <div className="fvr-tags">
                {job.requiredSkillNames?.slice(0, 3).map((skill) => (
                  <span key={skill} className="fvr-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="fvr-card-footer">
              <div className="fvr-price">
                <span className="fvr-price-label">BUDGET</span>
                <span className="fvr-price-value">
                  ${job.maxPayPerHour}
                  <span>/hr</span>
                </span>
              </div>
              <button
                className="fvr-apply-btn"
                onClick={() => setSelectedJob(job)}
                disabled={!user?.freelancerId}
              >
                Submit Proposal
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedJob && (
        <SubmitProposal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};
