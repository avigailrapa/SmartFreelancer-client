export interface Proposal {
  id: number;
  freelancerId: number;
  freelancerName: string;
  clientId: number;
  clientName: string;
  jobId: number;
  jobTitle: string;
  hourlyRate: number;
  estimatedHours: number;
  totalEstimatedPrice: number;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  isClientInvite: boolean;
}
