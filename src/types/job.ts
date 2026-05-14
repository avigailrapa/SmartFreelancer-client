export interface Job {
  jobId: number;
  clientId: number;
  clientName: string;
  title: string;
  description: string;
  requiredHours: number;
  deadline: string;
  maxPayPerHour: number;
  mainCategoryId: number;
  mainCategoryName?: string;
  status: string;
  assignedFreelancerId: number;
  assignedFreelancerName?: string;
  requiredSkillIds: number[];
  requiredSkillNames: string[];
}
