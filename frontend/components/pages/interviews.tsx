"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronDown, Clock, Plus, Search, SlidersHorizontal, Video } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { interviewsApi, Interview, InterviewType } from "@/lib/api/interviews"
import { candidatesApi } from "@/lib/api/candidates"
import { ScheduleInterviewModal } from "@/components/ScheduleInterviewModal"
import { toast } from 'sonner'

export function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("UPCOMING")
  
  // Modal state
  const [candidates, setCandidates] = useState<Array<{ id: string; name: string }>>([])
  const [interviewers, setInterviewers] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    async function fetchInterviews() {
      try {
        const response = await interviewsApi.getInterviews()
        
        if (response.error) {
          setError(response.error)
          setInterviews([])
        } else {
          setInterviews(response.data)
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching interviews:', err)
        setError('Failed to fetch interviews')
        setInterviews([])
        setLoading(false)
      }
    }

    async function fetchCandidatesAndInterviewers() {
      try {
        // Fetch ALL candidates
        const candidatesResponse = await candidatesApi.getAllCandidates()
        const formattedCandidates = candidatesResponse.map(candidate => ({
          id: candidate.id,
          name: candidate.name
        }))
        setCandidates(formattedCandidates)

        // TODO: Replace with actual interviewer fetching logic
        const employerResponse = await candidatesApi.getEmployers()
        const formattedEmployers = employerResponse.map(employer => ({
          id: employer.id,
          name: employer.name
        }))
        setInterviewers(formattedEmployers)
      } catch (err) {
        console.error('Error fetching candidates:', err)
      }
    }

    fetchInterviews()
    fetchCandidatesAndInterviewers()
  }, [])

  const handleScheduleInterview = async (interviewDetails: {
    candidateId: string;
    interviewDate: string;
    interviewTime: string;
    interviewers: string[];
    interviewType: InterviewType;
    duration?: number;
    notes?: string;
    jobApplicationId?: string;
  }) => {
    try {
      // Validate time format
      const [hours, minutes] = interviewDetails.interviewTime.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        toast.error('Invalid time format. Please use HH:MM format.');
        return;
      }

      // Combine date and time
      const scheduledDateTime = new Date(`${interviewDetails.interviewDate}T${interviewDetails.interviewTime}:00`);

      // Validate date
      if (isNaN(scheduledDateTime.getTime())) {
        toast.error('Invalid date or time. Please check your input.');
        return;
      }

      // Validate interviewers
      if (interviewDetails.interviewers.length === 0) {
        toast.error('Please select at least one interviewer.');
        return;
      }

      // Prepare interview data for API
      const interviewData = {
        candidateId: interviewDetails.candidateId,
        interviewers: interviewDetails.interviewers,
        interviewType: interviewDetails.interviewType,
        scheduledDate: scheduledDateTime.toISOString(),
        notes: interviewDetails.notes || '',
        duration: interviewDetails.duration || 60, // Default 1-hour interview
        jobApplicationId: interviewDetails.jobApplicationId
      }

      console.log('Scheduling Interview Data >', interviewData);

      // Call API to create interview
      const response = await interviewsApi.createInterview(interviewData)

      if (response.data) {
        // Update local interviews list
        setInterviews(prev => {
          // Ensure we only add non-null interviews
          const updatedInterviews = response.data ? [...prev, response.data] : prev;
          return updatedInterviews;
        });

        toast.success('Interview scheduled successfully');
      } else {
        toast.error(response.error || 'Failed to schedule interview');
      }
    } catch (error) {
      console.error('Failed to schedule interview:', error);
      toast.error('Failed to schedule interview');
    }
  };

  const filteredInterviews = interviews
    .filter(
      (interview) =>
        interview.status === activeTab &&
        (interview.candidate?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         interview.jobApplication?.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (loading) return <div>Loading interviews...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="h-full space-y-6">
      <PageHeader
        title="Interviews"
        description="Manage and schedule candidate interviews"
      >
          <ScheduleInterviewModal 
            candidates={candidates}
            interviewers={interviewers}
            onSchedule={handleScheduleInterview}
          />
      </PageHeader>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search interviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0">
                  Type
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Technical</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>HR Screening</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Portfolio Review</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Final Interview</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="shrink-0">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        <Tabs defaultValue="UPCOMING" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="UPCOMING">Upcoming</TabsTrigger>
            <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="UPCOMING" className="mt-4">
            <div className="grid gap-4">
              {filteredInterviews.length === 0 ? (
                <Card>
                  <CardContent className="flex h-[200px] items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Calendar className="h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No upcoming interviews</h3>
                      <p className="text-sm text-muted-foreground max-w-[300px]">
                        You don't have any upcoming interviews scheduled
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredInterviews.map((interview) => (
                  <Card key={interview.id}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {interview.candidate?.name?.slice(0,2).toUpperCase() || 'CN'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {interview.candidate?.name || 'Candidate'}
                          </h3>
                          <Badge variant="secondary" className="pointer-events-none">
                            {interview.interviewType}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {interview.jobApplication?.job?.title || 'Unknown Job Role'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {interview.scheduledDate 
                                ? new Date(interview.scheduledDate).toLocaleString() 
                                : 'Date not set'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{interview.duration || 45} minutes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>With:</span>
                            <span>
                              {interview.interviewers?.length 
                                ? interview.interviewers.join(", ") 
                                : 'No interviewers'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline">
                          <Video className="mr-2 h-4 w-4" />
                          Join Meeting
                        </Button>
                        <Button asChild>
                          <Link href={`/interviews/${interview.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="COMPLETED" className="mt-4">
            <div className="grid gap-4">
              {filteredInterviews.length === 0 ? (
                <Card>
                  <CardContent className="flex h-[200px] items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Calendar className="h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No completed interviews</h3>
                      <p className="text-sm text-muted-foreground max-w-[300px]">
                        You don't have any completed interviews
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredInterviews.map((interview) => (
                  <Card key={interview.id}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {interview.candidate?.name?.slice(0,2).toUpperCase() || 'CN'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {interview.candidate?.name || 'Candidate'}
                          </h3>
                          <Badge variant="secondary" className="pointer-events-none">
                            {interview.interviewType}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {interview.jobApplication?.job?.title || 'Job Role'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {interview.scheduledDate 
                                ? new Date(interview.scheduledDate).toLocaleString() 
                                : 'Date not set'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{interview.duration || 45} minutes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>With:</span>
                            <span>
                              {interview.interviewers?.length 
                                ? interview.interviewers.join(", ") 
                                : 'No interviewers'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline">
                          <Video className="mr-2 h-4 w-4" />
                          Join Meeting
                        </Button>
                        <Button asChild>
                          <Link href={`/interviews/${interview.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
