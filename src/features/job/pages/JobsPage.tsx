import { useGetOpenJobsQuery } from "../redux/api";
import type { Job } from "../../../types/job";
import "./JobsPages.css";

export const JobsPage = () => {
  const { data: jobs, isLoading, error } = useGetOpenJobsQuery();

  if (isLoading)
    return <div className="loader">Searching for opportunities...</div>;
  if (error)
    return (
      <div className="error">We encountered an issue loading the jobs.</div>
    );

  return (
    <div className="marketplace-wrapper">
      <header className="marketplace-header">
        <h1>Explore Open Projects</h1>
        <p>Work with talented clients on exciting new challenges</p>
      </header>

      <div className="jobs-grid">
        {jobs?.map((job: Job) => (
          <div key={job.jobId} className="job-card">
            <div className="card-top">
              <div className="client-avatar">{job.clientName[0]}</div>
              <div className="client-info">
                <span className="client-name">{job.clientName}</span>
                <span className="job-date">Posted just now</span>
              </div>
            </div>

            <div className="card-body">
              <h3 className="job-title">{job.title}</h3>
              <p className="job-description">
                {job.description.length > 120
                  ? `${job.description.substring(0, 120)}...`
                  : job.description}
              </p>

              <div className="skill-tags">
                {job.requiredSkillNames?.slice(0, 3).map((skill) => (
                  <span key={skill} className="tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* חלק תחתון - מחיר ופעולה */}
            <div className="card-footer">
              <div className="price-section">
                <span className="price-label">BUDGET</span>
                <span className="price-value">
                  ${job.maxPayPerHour}
                  <span>/hr</span>
                </span>
              </div>
              <button className="view-details-btn">View Job</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
