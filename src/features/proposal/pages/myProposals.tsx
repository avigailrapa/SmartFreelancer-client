import {
  useGetMyProposalsQuery,
  useDeleteProposalMutation,
} from "../../proposal/redux/api";
import "./MyProposals.css";

export const MyProposals = () => {
  const { data: proposals, isLoading, isError } = useGetMyProposalsQuery();
  const [deleteProposal] = useDeleteProposalMutation();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong</p>;

  return (
    <div className="my-proposals-section">
      <h3>My Proposals</h3>

      {proposals?.length === 0 && <p className="empty">No proposals yet</p>}

      {proposals?.map((proposal) => (
        <div key={proposal.id} className="proposal-card">
          <div className="proposal-top">
            <div className="proposal-info">
              <h4>{proposal.jobTitle}</h4>
              <p className="client-name">Client: {proposal.clientName}</p>
              <p className="message">{proposal.message}</p>
              <div className="proposal-meta">
                <span> ${proposal.hourlyRate}/hr</span>
                <span> {proposal.estimatedHours} hrs</span>
                <span> Total: ${proposal.totalEstimatedPrice}</span>
                <span>{new Date(proposal.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="proposal-actions">
              <span className={`status-badge ${proposal.status.toLowerCase()}`}>
                {proposal.status}
              </span>
              {proposal.status === "Pending" && (
                <button
                  className="btn-withdraw"
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
