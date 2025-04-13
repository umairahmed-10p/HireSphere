"use client"

import { useState, useEffect } from "react"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Video, 
  Building, 
  Check, 
  X 
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Candidate, candidatesApi } from "@/lib/api/candidates"
import { interviewsApi, CreateInterviewData, InterviewType } from "@/lib/api/interviews"
import { useRouter } from "next/router"

export function ScheduleInterviewPage({ candidateId }: { candidateId: string }) {
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [selectedJob, setSelectedJob] = useState<string>("")
  const [interviewType, setInterviewType] = useState<InterviewType>("TECHNICAL")
  const [interviewDate, setInterviewDate] = useState<string>("")
  const [interviewTime, setInterviewTime] = useState<string>("")
  const [interviewers, setInterviewers] = useState<string[]>([])
  const [duration, setDuration] = useState<number>(45)
  const [notes, setNotes] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const fetchedCandidate = await candidatesApi.getCandidateById(candidateId)
        
        console.log('Fetched Candidate Full Data:', JSON.stringify(fetchedCandidate, null, 2))
        
        setCandidate(fetchedCandidate)
        
        // Defensive check for applications
        const candidateApplications = fetchedCandidate?.applications || []
        
        // Pre-select the first job application if exists
        if (candidateApplications.length > 0) {
          setSelectedJob(candidateApplications[0].job.id)
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load interview scheduling data')
        setLoading(false)
      }
    }

    fetchData()
  }, [candidateId])

  const handleScheduleInterview = async () => {
    try {
      // Validate inputs
      if (!selectedJob || !interviewDate || !interviewTime || interviewers.length === 0) {
        setError("Please fill in all required fields")
        return
      }

      // Validate time format
      const [hours, minutes] = interviewTime.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        setError('Invalid time format. Please use HH:MM format.');
        return;
      }

      // Combine date and time
      const scheduledDateTime = new Date(`${interviewDate}T${interviewTime}:00`);

      // Validate date
      if (isNaN(scheduledDateTime.getTime())) {
        setError('Invalid date or time. Please check your input.');
        return;
      }

      // Prepare interview data for API
      const interviewData: CreateInterviewData = {
        candidateId,
        jobApplicationId: selectedJob, 
        interviewers,
        interviewType,
        scheduledDate: scheduledDateTime.toISOString(),
        notes: notes || '',
        duration
      };

      console.log('Scheduling Interview Data >', interviewData);

      // Call API to schedule interview
      const result = await interviewsApi.createInterview(interviewData)

      // Check for errors
      if (result.error) {
        setError(result.error)
        return
      }

      // Show success message
      alert("Interview scheduled successfully!")

      // Redirect or reset form
      router.push(`/candidates/${candidateId}`);
    } catch (error) {
      console.error('Failed to schedule interview:', error)
      setError(error instanceof Error ? error.message : 'Failed to schedule interview')
    }
  }

  if (loading) return <div>Loading interview scheduling...</div>
  if (error) return <div>Error: {error}</div>
  if (!candidate) return <div>No candidate found</div>

  // Defensive check for applications
  const jobApplications = candidate?.applications || []

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Schedule Interview</h1>
        <Link href={`/candidates/${candidateId}`}>
          <Button variant="outline">
            Back to Candidate Profile
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 space-y-6">
          <CardHeader>
            <CardTitle>Interview Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Candidate</Label>
                <div className="flex items-center gap-2 bg-muted p-2 rounded">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span>{candidate.name}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Job Position</Label>
                <Select 
                  value={selectedJob} 
                  onValueChange={setSelectedJob}
                  disabled={jobApplications.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      jobApplications.length === 0 
                        ? "No job applications" 
                        : "Select Job"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {jobApplications.map(application => (
                      <SelectItem key={application.job.id} value={application.job.id}>
                        {application.job.title} {application.job.company ? `- ${application.job.company}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Interview Type</Label>
                <Select 
                  value={interviewType} 
                  onValueChange={(value: string) => setInterviewType(value as InterviewType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TECHNICAL">Technical Interview</SelectItem>
                    <SelectItem value="HR_SCREENING">HR Screening</SelectItem>
                    <SelectItem value="FINAL_INTERVIEW">Final Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input 
                  type="date" 
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Time</Label>
                <Input 
                  type="time" 
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Interview Duration</Label>
                <Select 
                  value={duration.toString()} 
                  onValueChange={(value) => setDuration(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Interviewers (comma-separated)</Label>
              <Input 
                placeholder="john@company.com, jane@company.com" 
                value={interviewers.join(', ')}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const newInterviewers = inputValue 
                    ? inputValue.split(',').map((interviewer: string) => interviewer.trim()).filter(Boolean)
                    : [];
                  setInterviewers(newInterviewers);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea 
                placeholder="Any additional context for the interview..." 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleScheduleInterview}
                disabled={!selectedJob || !interviewDate || !interviewTime || interviewers.length === 0}
              >
                Schedule Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
