"use client"

import React, { useState, useEffect, use } from 'react'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Briefcase, 
  Video, 
  FileText, 
  Star, 
  Check, 
  X, 
  Edit, 
  MessageCircle 
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'

import { interviewsApi, Interview, InterviewType } from '@/lib/api/interviews'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

import { RatingComponent } from '@/components/interviews/rating-component'
import { ScheduleInterviewModal } from '@/components/ScheduleInterviewModal'
import { candidatesApi } from '@/lib/api/candidates'

export default function InterviewDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Unwrap params using React.use()
  const { id } = use(params)

  const [interview, setInterview] = useState<Interview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [candidates, setCandidates] = useState<Array<{ id: string; name: string }>>([])
  const [interviewers, setInterviewers] = useState<Array<{ id: string; name: string }>>([])
  const [candidateDetails, setCandidateDetails] = useState<{
    name: string;
    email: string;
    jobRole: string;
    jobApplication?: {
      job?: {
        title: string;
      }
    }
  } | null>(null)

  useEffect(() => {
    async function fetchInterviewDetails() {
      try {
        const response = await interviewsApi.getInterviewById(id)
        
        if (response.error) {
          setError(response.error)
        } else {
          const interviewData = response.data as Interview;
          console.log('Interview Data Page>', interviewData);
          setInterview(interviewData);
          
          // Fetch candidate details if interview data is available
          if (interviewData && interviewData.candidateId && interviewData.jobApplicationId) {
            try {
              const [candidateResponse] = await Promise.all([
                candidatesApi.getCandidateById(interviewData.candidateId),
              ])
              
              setCandidateDetails({
                name: candidateResponse.name,
                email: candidateResponse.email,
                jobRole: interviewData.jobApplication?.job?.title || 'Unknown Job Role',
                jobApplication: interviewData.jobApplication && interviewData.jobApplication.job ? {
                  job: {
                    title: interviewData.jobApplication.job.title
                  }
                } : undefined
              })
            } catch (candidateError) {
              console.error('Error fetching candidate details:', candidateError)
              setError('Failed to fetch candidate details')
            }
          }
        }
      } catch (err) {
        console.error('Error fetching interview details:', err)
        setError('Failed to fetch interview details')
      } finally {
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

    fetchInterviewDetails()
    fetchCandidatesAndInterviewers()
  }, [id])

  const handleUpdateInterview = async (interviewDetails: {
    candidateId: string;
    jobApplicationId?: string;
    scheduledDate: string;
    interviewers: string[];
    interviewType: InterviewType;
    duration: number;
    notes?: string;
  }) => {
    try {
      if (!interview) {
        toast.error('No interview selected for editing');
        return;
      }

      // Call API to update interview
      const response = await interviewsApi.updateInterview(interview.id, interviewDetails);

      if (response.data) {
        // Update local interview
        setInterview(response.data as Interview);

        toast.success('Interview updated successfully');
      } else {
        setError(response.error || 'No interview data found');
      }
    } catch (error) {
      console.error('Failed to update interview:', error);
      toast.error('Failed to update interview');
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading interview details...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  if (!interview) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        No interview found
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Interview Overview */}
        <Card className="md:col-span-2 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              Interview Details
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Badge 
                variant={interview.status === 'COMPLETED' ? 'default' : 'secondary'}
              >
                {interview.status}
              </Badge>
              {interview.status === 'COMPLETED' && (
                <RatingComponent 
                  initialRating={interview.rating || 0}
                  interviewId={interview.id}
                />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback>
                  {candidateDetails?.name?.slice(0,2).toUpperCase() || 'CN'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {candidateDetails?.name || 'Candidate Name'}
                </h2>
                <p className="text-muted-foreground">
                  {candidateDetails?.jobRole || 'Job Role'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>
                  {interview.scheduledDate 
                    ? new Date(interview.scheduledDate).toLocaleString() 
                    : 'Date not set'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{interview.duration || 45} minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>
                  {interview.interviewers?.length 
                    ? interview.interviewers.join(", ") 
                    : 'No interviewers assigned'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-muted-foreground" />
                <span>{interview.interviewType}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Interview Notes</h3>
              <p className="text-muted-foreground">
                {interview.notes || 'No additional notes available'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Candidate & Job Details */}
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Candidate Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>{candidateDetails?.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <span>
                    {candidateDetails?.jobRole || 'No job role specified'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScheduleInterviewModal 
                candidates={candidates}
                interviewers={interviewers}
                onSchedule={handleUpdateInterview}
                initialData={{
                  id: interview.id,
                  candidateId: interview.candidateId,
                  jobApplicationId: interview.jobApplicationId,
                  scheduledDate: interview.scheduledDate,
                  interviewers: interview.interviewers,
                  interviewType: interview.interviewType,
                  duration: interview.duration,
                  notes: interview.notes
                }}
              >
                <Button className="w-full" variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> Edit Interview
                </Button>
              </ScheduleInterviewModal>
              <Button className="w-full" variant="default">
                <Video className="mr-2 h-4 w-4" /> Join Video Call
              </Button>
              <Button className="w-full" variant="secondary">
                <MessageCircle className="mr-2 h-4 w-4" /> Send Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
