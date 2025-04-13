export interface Job {
  id?: string;
  title: string;
  description: string;
  department: string;
  location: string;
  salary: number;
  status: 'OPEN' | 'CLOSED' | 'IN_PROGRESS';
  team: string;
  jobOverview: string[];
  responsibilities: string[];
  company?: string;
  userId?: string;
  hiringManager?: string;
  createdAt?: string;
  updatedAt?: string;
  numberOfApplicants?: number;
  documents?: ApplicationDocument[];
}

export interface ApplicationDocument {
  id: string;
  jobId: string;
  name: string;
  fileType: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
}

const BASE_URL = 'http://localhost:3009'

export const jobsApi = {
  getJobs() {
    return this.getAllJobs()
  },

  async getAllJobs() {
    try {
      const response = await fetch(`${BASE_URL}/jobs`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`)
        throw new Error(`Failed to fetch jobs: ${errorText}`)
      }
      
      const jobs = await response.json()
      return jobs as Job[]
    } catch (error) {
      console.error('Error fetching jobs:', error)
      throw error
    }
  },

  async getJobById(id: string) {
    try {
      const response = await fetch(`${BASE_URL}/jobs/${id}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`)
        throw new Error(`Failed to fetch job: ${errorText}`)
      }
      
      const job = await response.json()
      return job as Job
    } catch (error) {
      console.error('Error fetching job:', error)
      throw error
    }
  },

  async createJob(jobData: Partial<Job>) {
    try {
      const response = await fetch(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`)
        throw new Error(`Failed to create job: ${errorText}`)
      }
      
      const createdJob = await response.json()
      return createdJob
    } catch (error) {
      console.error('Error creating job:', error)
      throw error
    }
  },

  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    try {
      const response = await fetch(`${BASE_URL}/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData)
      })
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`)
        throw new Error(`Failed to update job: ${errorText}`)
      }
      
      const updatedJob = await response.json()
      return updatedJob
    } catch (error) {
      console.error('Comprehensive update job error:', error)
      throw error
    }
  },
}
