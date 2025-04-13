const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
const BASE_URL = 'http://localhost:3009'

export interface Candidate {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
  profile?: {
    skills?: string[];
    location?: string;
    bio?: string;
  };
  applications: Array<{
    id: string;
    job: {
      id: string;
      title: string;
      company: string;
    };
    status: 'APPLIED' | 'INTERVIEWED' | 'OFFERED' | 'REJECTED' | 'SCREENING';
    createdAt: string;
    currentStage?: string;
    tags?: string[];
    interviews?: Array<{
      id: string;
      interviewType: string;
      status: string;
      date: string;
      notes?: string;
      jobApplication: {
        id: string;
      };
    }>;
  }>;
}

export namespace candidatesApi {
  export async function getCandidates(filters?: {
    applicationStatus?: string;
  }): Promise<Candidate[]> {
    try {
      const url = new URL(`${BASE_URL}/candidates`)
      
      if (filters?.applicationStatus) {
        url.searchParams.append('applicationStatus', filters.applicationStatus)
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch candidates')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching candidates:', error)
      throw error
    }
  }

  export async function getCandidateById(id: string): Promise<Candidate> {
    try {
      const response = await fetch(`${BASE_URL}/candidates/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch candidate')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching candidate:', error)
      throw error
    }
  }

  export async function getCandidatesByJobId(
    jobId: string, 
    filters?: {
      applicationStatus?: string;
    }
  ): Promise<Candidate[]> {
    try {
      const url = new URL(`${BASE_URL}/candidates/job/${jobId}`)
      
      if (filters?.applicationStatus) {
        url.searchParams.append('applicationStatus', filters.applicationStatus)
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch candidates by job ID')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching candidates by job ID:', error)
      throw error
    }
  }

  export async function updateCandidateStatus(
    candidateId: string, 
    applicationId: string, 
    status: 'APPLIED' | 'INTERVIEWED' | 'OFFERED' | 'REJECTED' | 'SCREENING' | 'ASSESSMENT'
  ): Promise<Candidate> {
    try {
      const response = await fetch(`${BASE_URL}/candidates/${candidateId}/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error('Failed to update candidate status')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating candidate status:', error)
      throw error
    }
  }

  export async function createCandidate(candidateData: Omit<Candidate, 'id' | 'applications'>): Promise<Candidate> {
    try {
      const response = await fetch(`${BASE_URL}/candidates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(candidateData)
      })

      if (!response.ok) {
        throw new Error('Failed to create candidate')
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating candidate:', error)
      throw error
    }
  }

  export async function updateCandidate(
    candidateId: string, 
    candidateData: {
      name?: string;
      email?: string;
      profile?: {
        skills?: string[];
        location?: string;
        bio?: string;
      }
    }
  ): Promise<Candidate> {
    try {
      const response = await fetch(`${BASE_URL}/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(candidateData)
      })

      if (!response.ok) {
        throw new Error('Failed to update candidate')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating candidate:', error)
      throw error
    }
  }

  export async function getAllCandidates(): Promise<Candidate[]> {
    try {
      const response = await fetch(`${BASE_URL}/candidates/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch all candidates')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching all candidates:', error)
      throw error
    }
  }

  export async function getEmployers(): Promise<Candidate[]> {
    try {
      const response = await fetch(`${BASE_URL}/candidates/employers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch employers')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching employers:', error)
      throw error
    }
  }

  export async function getJobApplicationById(id: string): Promise<{
    id: string;
    job: {
      id: string;
      title: string;
      company: string;
    };
    status: 'APPLIED' | 'INTERVIEWED' | 'OFFERED' | 'REJECTED' | 'SCREENING';
    createdAt: string;
    currentStage?: string;
  }> {
    try {
      const response = await fetch(`${BASE_URL}/job-applications/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch job application')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching job application:', error)
      throw error
    }
  }
}
