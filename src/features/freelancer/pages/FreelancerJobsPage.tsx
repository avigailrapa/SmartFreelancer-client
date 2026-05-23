import { useGetFreelancerJobsQuery } from "../../job/redux/api";
import styles from "./FreelancerJobPage.module.scss";

export const FreelancerJobsPage = () => {
  const { data: jobs, isLoading, isError } = useGetFreelancerJobsQuery();

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (isError) {
    return (
      <div className={styles.error}>
        Something went wrong loading your jobs.
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1>My Jobs</h1>
        <p>Jobs you are working on or have completed</p>
      </div>

      <div className={styles.content}>
        {!jobs || jobs.length === 0 ? (
          <p className={styles.empty}>No jobs found.</p>
        ) : (
          jobs.map((job) => (
            <div key={job.jobId} className={styles.jobCard}>
              <div className={styles.jobTop}>
                <h3 className={styles.jobTitle}>{job.title}</h3>

                <span
                  className={`${styles.status} ${
                    job.status === "Completed"
                      ? styles.completed
                      : styles.inProgress
                  }`}
                >
                  {job.status === "InProgress" ? "In Progress" : job.status}
                </span>
              </div>

              <p className={styles.description}>{job.description}</p>

              <div className={styles.footer}>
                <span className={styles.price}>${job.maxPayPerHour}/hr</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
