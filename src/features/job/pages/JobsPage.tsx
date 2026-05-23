import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { useGetOpenJobsQuery } from "../redux/api";
import { SubmitProposal } from "../../proposal/components/SubmitProposal";
import type { Job } from "../../../types/job";
import styles from "./JobsPages.module.scss";

export const JobsPage = () => {
  const { data: jobs, isLoading, error } = useGetOpenJobsQuery();
  const user = useSelector((state: RootState) => state.user.user);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  if (isLoading)
    return <div className={styles.loader}>Searching for opportunities...</div>;
  if (error)
    return (
      <div className={styles.error}>
        We encountered an issue loading the jobs.
      </div>
    );

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Explore Open Projects</h1>
        <p>Work with talented clients on exciting new challenges</p>
      </header>

      <div className={styles.grid}>
        {jobs?.map((job: Job) => (
          <div key={job.jobId} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.avatar}>
                {job.clientName?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className={styles.clientInfo}>
                <span className={styles.clientName}>
                  {job.clientName ?? "Unknown"}
                </span>
              </div>
            </div>

            <div className={styles.cardBody}>
              <h3 className={styles.jobTitle}>{job.title}</h3>
              <p className={styles.jobDesc}>
                {(job.description ?? "").length > 120
                  ? `${job.description.substring(0, 120)}...`
                  : job.description}
              </p>
              <div className={styles.tags}>
                {job.requiredSkillNames?.slice(0, 3).map((skill) => (
                  <span key={skill} className={styles.tag}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.price}>
                <span className={styles.priceLabel}>BUDGET</span>
                <span className={styles.priceValue}>
                  ${job.maxPayPerHour}
                  <span>/hr</span>
                </span>
              </div>
              <button
                className={styles.applyBtn}
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
