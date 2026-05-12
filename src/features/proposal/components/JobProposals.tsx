import {
  useGetProposalsForJobQuery,
  useAcceptProposalMutation,
  useRejectProposalMutation,
} from "../redux/api";
import "./ProposalStyles.css";

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

  if (isLoading) return <div className="loading">Loading proposals...</div>;

  if (!proposals || proposals.length === 0) {
    return <div className="no-proposals">No proposals received yet.</div>;
  }

  return (
    <div className="proposals-list">
      <h3>Proposals ({proposals.length})</h3>

      {proposals.map((proposal) => (
        <div key={proposal.id} className={`proposal-card ${proposal.status}`}>
          <div className="proposal-header">
            <div className="freelancer-info">
              <h4>{proposal.freelancerName}</h4>
              <span className={`status-badge ${proposal.status}`}>
                {proposal.status}
              </span>
            </div>
            <div className="proposal-date">
              {new Date(proposal.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="proposal-details">
            <div className="pricing-info">
              <div className="rate">Hourly Rate: ${proposal.hourlyRate}</div>
              <div className="hours">
                Estimated Hours: {proposal.estimatedHours}
              </div>
              <div className="total">
                Total: ${proposal.totalEstimatedPrice.toFixed(2)}
              </div>
            </div>

            <div className="proposal-message">
              <h5>Cover Message:</h5>
              <p>{proposal.message}</p>
            </div>
          </div>

          {proposal.status === "pending" && (
            <div className="proposal-actions">
              <button
                className="accept-btn"
                onClick={() => handleAccept(proposal.id)}
                disabled={isAccepting}
              >
                {isAccepting ? "Accepting..." : "Accept Proposal"}
              </button>
              <button
                className="reject-btn"
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
