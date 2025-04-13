const BASE_URL = 'http://localhost:3009'

export type InterviewType = "TECHNICAL" | "HR_SCREENING" | "FINAL_INTERVIEW"
export type InterviewStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'

export type Interview = {
  id: string;
  candidateId: string;
  jobApplicationId: string;
  interviewers: string[];
  interviewType: InterviewType;
  status: InterviewStatus;
  scheduledDate: string;
  duration: number;
  notes?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
  
  // Additional fields to include related data
  candidate?: {
    id: string;
    name: string;
    email: string;
  } | null;
  jobApplication?: {
    id: string;
    job: {
      id: string;
      title: string;
    };
  } | null;
}

export interface CreateInterviewData {
  candidateId: string;
  jobApplicationId?: string;
  interviewers: string[];
  interviewType: InterviewType;
  scheduledDate: string;
  duration?: number;
  notes?: string;
}

export interface InterviewApiResponse {
  data?: Interview;
  error?: string;
}

export interface InterviewsApiResponse {
  data: Interview[];
  error?: string;
}

export const interviewsApi = {
  async getInterviews(): Promise<InterviewsApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/interviews`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        return { 
          data: [], 
          error: errorText 
        };
      }
      
      const data = await response.json();
      console.log('Interviews response:', data);
      return { 
        data, 
        error: undefined 
      };
    } catch (error) {
      console.error('Error in getInterviews:', error);
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Failed to fetch interviews' 
      };
    }
  },

  async getInterviewById(id: string): Promise<InterviewApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/interviews/${id}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        return { error: errorText };
      }
      
      const data = await response.json();
      console.log('Interview response RAW:', data);
      return { data };
    } catch (error) {
      console.error(`Error in getInterviewById for id ${id}:`, error);
      return { 
        error: error instanceof Error ? error.message : `Failed to fetch interview with id ${id}` 
      };
    }
  },

  async createInterview(data: CreateInterviewData): Promise<InterviewApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId: data.candidateId,
          jobApplicationId: data.jobApplicationId,
          interviewType: data.interviewType,
          scheduledDate: data.scheduledDate,
          interviewers: data.interviewers,
          duration: data.duration || 45,
          notes: data.notes || ''
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        return { error: errorText || 'Failed to create interview' };
      }

      const createdInterview = await response.json();
      return { data: createdInterview };
    } catch (error) {
      console.error('Error creating interview:', error);
      return { 
        error: error instanceof Error ? error.message : 'Failed to create interview' 
      };
    }
  },

  async updateInterview(id: string, interviewData: Partial<Interview>): Promise<InterviewApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/interviews/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interviewData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        return { error: errorText };
      }
      
      const data = await response.json();
      
      return { data };
    } catch (error) {
      console.error(`Error in updateInterview for id ${id}:`, error);
      return { 
        error: error instanceof Error ? error.message : `Failed to update interview with id ${id}` 
      };
    }
  },

  async updateInterview(id: string, interviewData: CreateInterviewData): Promise<InterviewApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/interviews/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interviewData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        return { error: errorText };
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error(`Error in updateInterview for id ${id}:`, error);
      return { 
        error: error instanceof Error ? error.message : `Failed to update interview with id ${id}` 
      };
    }
  },

  async deleteInterview(id: string): Promise<InterviewApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/interviews/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        return { error: errorText };
      }
      
      const data = await response.json();
      console.log(`Deleted interview with id ${id}:`, data);
      
      return { data };
    } catch (error) {
      console.error(`Error in deleteInterview for id ${id}:`, error);
      return { 
        error: error instanceof Error ? error.message : `Failed to delete interview with id ${id}` 
      };
    }
  },

  async updateInterviewRating(id: string, rating: number): Promise<InterviewApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/interviews/${id}/rating`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        return { error: errorText };
      }
      
      const data = await response.json();
      
      return { data };
    } catch (error) {
      console.error(`Error in updateInterviewRating for id ${id}:`, error);
      return { 
        error: error instanceof Error ? error.message : `Failed to update interview rating with id ${id}` 
      };
    }
  }
}
