import { useState } from "react";
import { useGetOptimalJobsQuery } from "../../matching/redux/api";
import { SubmitProposal } from "../../proposal/components/SubmitProposal";
import type { Job } from "../../../types/job";
import "../../job/pages/JobsPages.css";

export const OptimizationPage = () => {
  const {
    data: jobs,
    isLoading,
    refetch,
    isFetching,
  } = useGetOptimalJobsQuery();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <div className="fvr-wrapper">
      <header className="fvr-header">
        <div className="fvr-header-row">
          <div>
            <h1>Optimization Engine</h1>
            <p>Jobs matched to your skills &amp; availability</p>
          </div>
          <button
            className="fvr-refresh-btn"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? (
              <>
                <span className="fvr-spinner fvr-spinner--dark" />{" "}
                Calculating...
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                Find Optimal Jobs
              </>
            )}
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="fvr-loader">Analyzing market opportunities...</div>
      ) : !jobs?.length ? (
        <div className="fvr-error">No optimal jobs found. Try refreshing.</div>
      ) : (
        <div className="fvr-grid">
          {jobs?.map((job: Job) => {
            const total = job.requiredHours * job.maxPayPerHour;

            return (
              <div key={job.id} className="fvr-card">
                <div className="fvr-card-top">
                  <div className="fvr-avatar">
                    {(
                      job.clientName?.[0] ??
                      job.title?.[0] ??
                      "?"
                    ).toUpperCase()}
                  </div>
                  <div className="fvr-client-info">
                    <span className="fvr-client-name">
                      {job.clientName ?? "Unknown"}
                    </span>
                    <span className="fvr-date">Matched for you</span>
                  </div>
                </div>

                <div className="fvr-card-body">
                  <h3 className="fvr-job-title">{job.title}</h3>
                  {job.description && (
                    <p className="fvr-job-desc">
                      {job.description.length > 120
                        ? `${job.description.substring(0, 120)}...`
                        : job.description}
                    </p>
                  )}
                  <div className="fvr-tags">
                    {job.requiredSkillNames
                      ?.slice(0, 3)
                      .map((skill: string) => (
                        <span key={skill} className="fvr-tag">
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="fvr-card-footer">
                  <div className="fvr-price">
                    <span className="fvr-price-label">TOTAL</span>
                    <span className="fvr-price-value">
                      ${total.toLocaleString()}
                      <span> ({job.requiredHours}h)</span>
                    </span>
                  </div>
                  <button
                    className="fvr-apply-btn"
                    onClick={() => setSelectedJob(job)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedJob && (
        <SubmitProposal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};
