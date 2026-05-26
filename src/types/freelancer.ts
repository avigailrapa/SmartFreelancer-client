export interface Rating {
  id: number;
  freelancerId: number;
  freelancerName: string;
  userId: number;
  userName: string;
  stars: number;
  comment: string;
  createdAt: string;
}

export interface Freelancer {
  freelancerId: number;
  userName: string;
  mainCategoryId: number;
  mainCategoryName?: string;
  image?: string;
  bio: string;
  availableHours: number;
  availableUntil:string;
  hourlyRate: number;
  averageStars: number;
  email: string;
  experienceLevel: string;
  status: string;
  specializationIds?: number[];
  specializationNames?: string[];
  skillIds?: number[];
  skillNames?: string[];
  latestRating?: Rating;
}