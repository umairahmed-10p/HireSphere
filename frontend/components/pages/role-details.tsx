"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Edit, FileText, MapPin, MoreHorizontal, Plus, Share2, Users } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PipelineView } from "@/components/pipeline-view"
import { HiringTimeline } from "@/components/hiring-timeline"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { jobsApi, Job } from "@/lib/api/jobs"
import { JobShareDialog } from "@/components/job-share-dialog"

interface RoleDetailsPageProps {
  id: string
}

export function RoleDetailsPage({ id }: RoleDetailsPageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("pipeline")
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchJobDetails() {
      try {
        const jobData = await jobsApi.getJobById(id)
        setJob(jobData)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching job details:', err)
        setError('Failed to fetch job details')
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [id])

  if (loading) return <div>Loading job details...</div>
  if (error) return <div>Error: {error}</div>
  if (!job) return <div>No job found</div>

  const handleEditJob = () => {
    if (job) {
      router.push(`/roles/new?id=${job.id}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/roles">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2"></p>
            <h2 className="text-2xl font-bold tracking-tight">{job.title}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{job.department}</span>
              <span>•</span>
              <div className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                {job.location}
              </div>
              <span>•</span>
              <span>Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            asChild 
            variant="outline" 
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
          >
            <Link href={`/jobs/${job.id}`}>
              View Details
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => setIsShareDialogOpen(true)}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleEditJob}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Duplicate role</DropdownMenuItem>
              <DropdownMenuItem>Export candidates</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Close role</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="default" className="text-sm">
          {job.status}
        </Badge>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-1 h-4 w-4" />
          {job.numberOfApplicants || 0} applicants
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          Job posting active
        </div>
      </div>

      <Tabs defaultValue="pipeline" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="details">Role Details</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="pipeline" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Candidate Pipeline</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Candidate
            </Button>
          </div>
          <PipelineView roleId={id} />
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              
            </div>
          )}
        </TabsContent>
        <TabsContent value="details" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Description</CardTitle>
              <CardDescription>Details about the role and requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Overview</h4>
                <p className="text-sm text-muted-foreground">{job.description}</p>
              </div>
              {job.jobOverview && job.jobOverview.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Job Overview</h4>
                  <div className="text-sm text-muted-foreground">
                    {job.jobOverview.map((line: string, index: number) => (
                      <p key={index} className="mb-1">• {line.trim()}</p>
                    ))}
                  </div>
                </div>
              )}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Responsibilities</h4>
                  <div className="text-sm text-muted-foreground">
                    {job.responsibilities.map((line: string, index: number) => (
                      <p key={index} className="mb-1">• {line.trim()}</p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Role Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Department</span>
                  <span className="text-sm text-muted-foreground">{job.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Location</span>
                  <span className="text-sm text-muted-foreground">{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Salary Range</span>
                  <span className="text-sm text-muted-foreground">{job.salary ? `$${job.salary}` : 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Team</span>
                  <span className="text-sm text-muted-foreground">{job.team || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Hiring Manager</span>
                  <span className="text-sm text-muted-foreground">{job.hiringManager || 'Not specified'}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Application Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {job.documents && job.documents.length > 0 ? (
                  <div className="space-y-2">
                    {job.documents.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="flex justify-between items-center border-b pb-2 last:border-b-0"
                      >
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.fileType}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a 
                            href={doc.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      {job && (
        <JobShareDialog 
          job={job} 
          open={isShareDialogOpen} 
          onOpenChange={setIsShareDialogOpen} 
        />
      )}
    </div>
  )
}
