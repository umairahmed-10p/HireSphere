import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { candidatesApi } from "@/lib/api/candidates"
import { jobsApi } from "@/lib/api/jobs"
import { toast } from "sonner"
import { InterviewType } from "@/lib/api/interviews"

interface JobApplication {
  id: string;
  job: {
    id: string;
    title: string;
    company?: string;
  };
}

interface ScheduleInterviewModalProps {
  candidates: Array<{ id: string; name: string }>;
  interviewers: Array<{ id: string; name: string }>;
  onSchedule: (interviewDetails: {
    candidateId: string;
    jobApplicationId?: string;
    scheduledDate: string;
    interviewers: string[];
    interviewType: InterviewType;
    duration: number;
    notes?: string;
  }) => void;
  initialData?: {
    id?: string;
    candidateId?: string;
    jobApplicationId?: string;
    scheduledDate?: string;
    interviewers?: string[];
    interviewType?: InterviewType;
    duration?: number;
    notes?: string;
  };
  children?: React.ReactNode;
}

// Explicitly define the interview type labels to ensure type safety
const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  TECHNICAL: 'Technical Interview',
  PORTFOLIO_REVIEW: 'Portfolio Review',
  FINAL_INTERVIEW: 'Final Interview',
  HR_SCREENING: 'HR Screening'
}

// Interview duration options
const DURATION_OPTIONS = [
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' }
]

export function ScheduleInterviewModal({ 
  candidates, 
  interviewers, 
  onSchedule, 
  initialData, 
  children 
}: ScheduleInterviewModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([])
  const [formData, setFormData] = useState({
    candidateId: initialData?.candidateId || '',
    jobApplicationId: initialData?.jobApplicationId || '',
    interviewDate: initialData?.scheduledDate ? new Date(initialData.scheduledDate).toISOString().split('T')[0] : '',
    interviewTime: initialData?.scheduledDate ? new Date(initialData.scheduledDate).toISOString().split('T')[1].slice(0, 5) : '',
    interviewers: initialData?.interviewers || [] as string[],
    interviewType: initialData?.interviewType || '' as InterviewType,
    duration: initialData?.duration || 45,
    notes: initialData?.notes || ''
  })
  const [isLoading, setIsLoading] = useState({
    jobApplications: false
  })

  // Fetch job applications when a candidate is selected
  useEffect(() => {
    async function fetchJobApplications() {
      if (!formData.candidateId) {
        setJobApplications([])
        return
      }

      try {
        setIsLoading(prev => ({ ...prev, jobApplications: true }))
        
        // Fetch the candidate's details to get their applications
        const candidate = await candidatesApi.getCandidateById(formData.candidateId)
        
        // Filter applications that are in an active state
        const activeApplications = candidate.applications.filter(
          app => ['APPLIED', 'SCREENING'].includes(app.status)
        )

        setJobApplications(activeApplications.map(app => ({
          id: app.id,
          job: app.job
        })))
      } catch (error) {
        console.error('Failed to fetch job applications:', error)
        toast.error('Failed to load job applications')
      } finally {
        setIsLoading(prev => ({ ...prev, jobApplications: false }))
      }
    }

    fetchJobApplications()
  }, [formData.candidateId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validate required fields
      if (!formData.candidateId || !formData.interviewDate || !formData.interviewTime || 
          formData.interviewers.length === 0 || !formData.interviewType) {
        toast.error('Please fill in all required fields')
        return
      }

      console.log('Scheduling interview with data:', {
        ...formData,
        scheduledDate: `${formData.interviewDate}T${formData.interviewTime}`
      });

      // Call the provided onSchedule function
      onSchedule({
        ...formData,
        scheduledDate: `${formData.interviewDate}T${formData.interviewTime}`
      })
      
      // Show success toast
      toast.success('Interview scheduled successfully')
      
      // Close the dialog
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to schedule interview:', error)
      toast.error('Failed to schedule interview')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || <Button>Schedule Interview</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Schedule New Interview</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="candidateId" className="text-right">
              Candidate
            </Label>
            <Select 
              name="candidateId"
              value={formData.candidateId}
              onValueChange={(value) => {
                // Reset job application when candidate changes
                setFormData(prev => ({ 
                  ...prev, 
                  candidateId: value,
                  jobApplicationId: '' 
                }))
              }}
              required
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Candidate" />
              </SelectTrigger>
              <SelectContent>
                {candidates.map((candidate) => (
                  <SelectItem key={candidate.id} value={candidate.id}>
                    {candidate.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jobApplicationId" className="text-right">
              Job Application
            </Label>
            <Select 
              name="jobApplicationId"
              value={formData.jobApplicationId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, jobApplicationId: value }))}
              disabled={!formData.candidateId || isLoading.jobApplications || jobApplications.length === 0}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={
                  !formData.candidateId
                    ? "Select a candidate first"
                    : isLoading.jobApplications 
                      ? "Loading applications..." 
                      : jobApplications.length === 0 
                        ? "No active job applications" 
                        : "Select Job Application"
                } />
              </SelectTrigger>
              <SelectContent>
                {jobApplications.map((application) => (
                  <SelectItem key={application.id} value={application.id}>
                    {application.job.title} {application.job.company ? `- ${application.job.company}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="interviewDate" className="text-right">
              Interview Date
            </Label>
            <Input 
              id="interviewDate" 
              name="interviewDate"
              type="date"
              value={formData.interviewDate}
              onChange={handleInputChange}
              className="col-span-3" 
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="interviewTime" className="text-right">
              Interview Time
            </Label>
            <Input 
              id="interviewTime" 
              name="interviewTime"
              type="time"
              value={formData.interviewTime}
              onChange={handleInputChange}
              className="col-span-3" 
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="interviewers" className="text-right">
              Interviewers
            </Label>
            <MultiSelect 
              name="interviewers"
              options={interviewers.map(interviewer => ({ 
                value: interviewer.name, 
                label: interviewer.name 
              }))}
              value={formData.interviewers}
              onValueChange={(values) => setFormData(prev => ({ 
                ...prev, 
                interviewers: values 
              }))}
              placeholder="Select Interviewers"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="interviewType" className="text-right">
              Interview Type
            </Label>
            <Select 
              name="interviewType"
              value={formData.interviewType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, interviewType: value as InterviewType }))}
              required
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Interview Type" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(INTERVIEW_TYPE_LABELS) as InterviewType[]).map((type) => (
                  <SelectItem key={type} value={type}>
                    {INTERVIEW_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration
            </Label>
            <Select 
              name="duration"
              value={formData.duration.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}
              required
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Duration" />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Additional Notes
            </Label>
            <Input 
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="col-span-3" 
              placeholder="Optional notes"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              Schedule Interview
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
