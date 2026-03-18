export interface Freelancer {
  freelancerId: number
  userName: string
  mainCategoryId: number
  mainCategoryName?: string

  bio: string
  availableHours: number
  hourlyRate: number
  averageStars: number

  experienceLevel: number
  status: number

  specializationIds?: number[]
  specializationNames?: string[]

  skillIds?: number[]
  skillNames?: string[]

  arrImage?: number[]
}
