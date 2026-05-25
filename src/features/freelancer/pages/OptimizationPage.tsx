import { useState } from "react";
import { useGetOptimalJobsQuery } from "../../matching/redux/api";
import { SubmitProposal } from "../../proposal/components/SubmitProposal";
import type { Job } from "../../../types/job";
import styles from "../../job/pages/JobsPages.module.scss"

export const OptimizationPage = () => {
  const {
    data: jobs,
    isLoading,
    refetch,
    isFetching,
  } = useGetOptimalJobsQuery();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <div>
            <h1>Optimization Engine</h1>
            <p>Jobs matched to your skills &amp; availability</p>
          </div>
          <button
            className={styles.refreshBtn}
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? (
              <>
                {/* שימוש ב-template literal למחלקה כפולה */}
                <span
                  className={`${styles.spinner} ${styles.spinnerDark}`}
                />{" "}
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
        <div className={styles.loader}>Analyzing market opportunities...</div>
      ) : !jobs?.length ? (
        <div className={styles.error}>
          No optimal jobs found. Try refreshing.
        </div>
      ) : (
        <div className={styles.grid}>
          {jobs?.map((job: Job) => {
            const total = job.requiredHours * job.maxPayPerHour;

            return (
              <div key={job.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.avatar}>
                    {(
                      job.clientName?.[0] ??
                      job.title?.[0] ??
                      "?"
                    ).toUpperCase()}
                  </div>
                  <div className={styles.clientInfo}>
                    <span className={styles.clientName}>
                      {job.clientName ?? "Unknown"}
                    </span>
                    <span className={styles.date}>Matched for you</span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.jobTitle}>{job.title}</h3>
                  {job.description && (
                    <p className={styles.jobDesc}>
                      {job.description.length > 120
                        ? `${job.description.substring(0, 120)}...`
                        : job.description}
                    </p>
                  )}
                  <div className={styles.tags}>
                    {job.requiredSkillNames
                      ?.slice(0, 3)
                      .map((skill: string) => (
                        <span key={skill} className={styles.tag}>
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.price}>
                    <span className={styles.priceLabel}>TOTAL</span>
                    <span className={styles.priceValue}>
                      ${total.toLocaleString()}
                      <span> ({job.requiredHours}h)</span>
                    </span>
                  </div>
                  <button
                    className={styles.applyBtn}
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
