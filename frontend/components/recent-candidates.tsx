import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useState, useEffect } from "react"
import { candidatesApi } from "@/lib/api/candidates"
import { getStatusColor } from '@/components/pages/candidate-profile'

export function RecentCandidates() {
  const [candidates, setCandidates] = useState<candidatesApi.Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecentCandidates() {
      try {
        // Fetch latest candidates, sorted by most recent application
        const fetchedCandidates = await candidatesApi.getCandidates({
        })

        // Sort candidates by most recent application date
        const sortedCandidates = fetchedCandidates.sort((a, b) => {
          const latestApplicationA = a.applications[0]?.createdAt || ''
          const latestApplicationB = b.applications[0]?.createdAt || ''
          return new Date(latestApplicationB).getTime() - new Date(latestApplicationA).getTime()
        })

        // Take top 4 most recent candidates
        setCandidates(sortedCandidates.slice(0, 4))
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching recent candidates:', err)
        setError('Failed to load recent candidates')
        setIsLoading(false)
      }
    }

    fetchRecentCandidates()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Candidates</CardTitle>
          <CardDescription>Loading recent candidates...</CardDescription>
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
          <CardTitle>Recent Candidates</CardTitle>
          <CardDescription>Error loading candidates</CardDescription>
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
        <CardTitle>Recent Candidates</CardTitle>
        <CardDescription>Latest candidates that have applied or moved stages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {candidates.map((candidate) => {
            // Get the most recent application
            const latestApplication = candidate.applications[0]
            
            return (
              <div 
                key={candidate.id} 
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={candidate.avatar} alt={candidate.name} />
                    <AvatarFallback>{candidate.initials || candidate.name.slice(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {latestApplication?.job?.title || 'No current application'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(latestApplication.status)} variant="outline">{latestApplication?.status || 'Unknown'}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {latestApplication?.createdAt 
                          ? new Date(latestApplication.createdAt).toLocaleDateString() 
                          : 'No date'}
                      </span>
                    </div>
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/candidates/${candidate.id}`}>View</Link>
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
