 export interface JwtPayload {
  UserId: string;
  FreelancerId?: string;
  role: "User" | "Freelancer";
}
