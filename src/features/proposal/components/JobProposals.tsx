import {
  useGetProposalsForJobQuery,
  useAcceptProposalMutation,
  useRejectProposalMutation,
} from "../redux/api";
import styles from "./ProposalStyles.module.scss";

interface JobProposalsProps {
  jobId: number;
}

export const JobProposals = ({ jobId }: JobProposalsProps) => {
  const { data: proposals, isLoading } = useGetProposalsForJobQuery(jobId);
  const [acceptProposal, { isLoading: isAccepting }] =
    useAcceptProposalMutation();
  const [rejectProposal, { isLoading: isRejecting }] =
    useRejectProposalMutation();

  const handleAccept = async (proposalId: number) => {
    if (window.confirm("Are you sure you want to accept this proposal?")) {
      try {
        await acceptProposal(proposalId).unwrap();
        alert("Proposal accepted successfully!");
      } catch (err: any) {
        alert(`Error: ${err.data?.message || "Something went wrong"}`);
      }
    }
  };

  const handleReject = async (proposalId: number) => {
    if (window.confirm("Are you sure you want to reject this proposal?")) {
      try {
        await rejectProposal(proposalId).unwrap();
        alert("Proposal rejected.");
      } catch (err: any) {
        alert(`Error: ${err.data?.message || "Something went wrong"}`);
      }
    }
  };

  if (isLoading)
    return <div className={styles.loading}>Loading proposals...</div>;
  if (!proposals || proposals.length === 0)
    return <div className={styles.noProposals}>No proposals received yet.</div>;

  return (
    <div className={styles.proposalsList}>
      <h3>Proposals ({proposals.length})</h3>

      {proposals.map((proposal) => (
        <div
          key={proposal.id}
          className={`${styles.proposalCard} ${styles[proposal.status]}`}
        >
          <div className={styles.proposalHeader}>
            <div className={styles.freelancerInfo}>
              <h4>{proposal.freelancerName}</h4>
              <span
                className={`${styles.statusBadge} ${styles[proposal.status]}`}
              >
                {proposal.status}
              </span>
            </div>
            <div className={styles.proposalDate}>
              {new Date(proposal.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className={styles.pricingInfo}>
            <div>Hourly Rate: ${proposal.hourlyRate}</div>
            <div>Estimated Hours: {proposal.estimatedHours}</div>
            <div className={styles.total}>
              Total: ${proposal.totalEstimatedPrice.toFixed(2)}
            </div>
          </div>

          <div className={styles.proposalMessage}>
            <h5>Cover Message:</h5>
            <p>{proposal.message}</p>
          </div>

          {proposal.status === "Pending" && (
            <div className={styles.proposalActions}>
              <button
                className={styles.acceptBtn}
                onClick={() => handleAccept(proposal.id)}
                disabled={isAccepting}
              >
                {isAccepting ? "Accepting..." : "Accept Proposal"}
              </button>
              <button
                className={styles.rejectBtn}
                onClick={() => handleReject(proposal.id)}
                disabled={isRejecting}
              >
                {isRejecting ? "Rejecting..." : "Reject"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
