import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useState, useEffect } from "react"
import { candidatesApi } from "@/lib/api/candidates"
import { format, parseISO } from "date-fns"

export function UpcomingInterviews() {
  const [interviews, setInterviews] = useState<{
    candidateName: string;
    role: string;
    interviewType: string;
    interviewers: string[];
    avatar?: string;
    initials?: string;
    date: string;
    originalDate: string;
    id: string;
  }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUpcomingInterviews() {
      try {
        // Fetch all candidates with their interviews
        const fetchedCandidates = await candidatesApi.getCandidates()

        // Collect all interviews across all candidates
        const allInterviews: any[] = []
        fetchedCandidates.forEach(candidate => {
          candidate.applications.forEach(application => {
            
            if (application.interviews && application.interviews.length > 0) {
              
              application.interviews.forEach(interview => {
                try {
                  const formattedDate = format(parseISO(interview.date), "EEEE, h:mm a")
                  
                  allInterviews.push({
                    candidateName: candidate.name,
                    role: application.job.title,
                    interviewType: interview.interviewType,
                    interviewers: [], // Note: We might need to modify API to include interviewer names
                    avatar: candidate.avatar,
                    initials: candidate.initials || candidate.name.slice(0,2).toUpperCase(),
                    date: formattedDate,
                    originalDate: interview.date,
                    id: interview.id
                  })
                } catch (parseError) {
                  console.error(`Error parsing date for interview ${interview.id}:`, parseError)
                }
              })
            } else {
              console.log(`No interviews found for ${candidate.name}'s application`)
            }
          })
        })


        // Sort interviews by date and take top 3
        const sortedInterviews = allInterviews
          // .filter(interview => {
          //   const interviewDate = new Date(interview.originalDate)
          //   const today = new Date()
          //   const isUpcoming = interviewDate >= today
          //   console.log(`Interview ${interview.id} date: ${interviewDate}, Is Upcoming: ${isUpcoming}`)
          //   return isUpcoming
          // })
          .sort((a, b) => new Date(a.originalDate).getTime() - new Date(b.originalDate).getTime())
          .slice(0, 3)

        setInterviews(sortedInterviews)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching upcoming interviews:', err)
        setError('Failed to load upcoming interviews')
        setIsLoading(false)
      }
    }

    fetchUpcomingInterviews()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
          <CardDescription>Loading scheduled interviews...</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
          <CardDescription>Error loading interviews</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Interviews</CardTitle>
        <CardDescription>Scheduled interviews for the next few days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {interviews.length === 0 ? (
            <p className="text-muted-foreground text-center">No upcoming interviews found</p>
          ) : (
            interviews.map((interview) => (
              <div key={interview.id} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={interview.avatar} alt={interview.candidateName} />
                    <AvatarFallback>{interview.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{interview.candidateName}</p>
                    <p className="text-sm text-muted-foreground">{interview.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{interview.interviewType}</Badge>
                      <span className="text-xs text-muted-foreground">{interview.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Join
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/interviews/${interview.id}`}>Details</Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
