import {
  useGetMyProposalsQuery,
  useDeleteProposalMutation,
} from "../../proposal/redux/api";
import styles from "./MyProposals.module.scss";

export const MyProposals = () => {
  const { data: proposals, isLoading, isError } = useGetMyProposalsQuery();
  const [deleteProposal] = useDeleteProposalMutation();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong</p>;

  return (
    <div className={styles.section}>
      <h3>My Proposals</h3>

      {proposals?.length === 0 && (
        <p className={styles.empty}>No proposals yet</p>
      )}

      {proposals?.map((proposal) => (
        <div key={proposal.id} className={styles.card}>
          <div className={styles.top}>
            <div className={styles.info}>
              <h4>{proposal.jobTitle}</h4>
              <p className={styles.clientName}>Client: {proposal.clientName}</p>
              <p className={styles.message}>{proposal.message}</p>
              <div className={styles.meta}>
                <span>${proposal.hourlyRate}/hr</span>
                <span>{proposal.estimatedHours} hrs</span>
                <span>Total: ${proposal.totalEstimatedPrice}</span>
                <span>{new Date(proposal.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <span
                className={`${styles.badge} ${styles[proposal.status.toLowerCase()]}`}
              >
                {proposal.status}
              </span>
              {proposal.status === "Pending" && (
                <button
                  className={styles.withdrawBtn}
                  onClick={() => deleteProposal(proposal.id)}
                >
                  Withdraw
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
