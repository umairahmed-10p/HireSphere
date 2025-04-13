"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Calendar,
  Check,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Star,
  ThumbsUp,
  X,
} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { candidatesApi, Candidate } from "@/lib/api/candidates"
import { format, parseISO } from "date-fns"

export function getStatusColor(status: string): string {
  switch (status) {
    case 'APPLIED':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'SCREENING':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'INTERVIEW':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'OFFER':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'HIRED':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
    case 'REJECTED':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
}

export function CandidateProfilePage({ id }: { id: string }) {
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedCandidate, setEditedCandidate] = useState<{
    name: string;
    email: string;
    bio: string;
    location: string;
    skills: string;
  } | null>(null)

  useEffect(() => {
    async function fetchCandidateProfile() {
      try {
        setLoading(true)
        console.log("Fetching candidate with ID:", id)
        const fetchedCandidate = await candidatesApi.getCandidateById(id)
        setCandidate(fetchedCandidate)
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch candidate profile:', err)
        setError('Failed to load candidate profile')
        setLoading(false)
      }
    }

    fetchCandidateProfile()
  }, [id])

  const handleEditProfile = () => {
    if (candidate) {
      setEditedCandidate({
        name: candidate.name,
        email: candidate.email,
        bio: candidate.profile?.bio || '',
        location: candidate.profile?.location || '',
        skills: candidate.profile?.skills?.join(', ') || '',
      })
      setIsEditDialogOpen(true)
    }
  }

  const handleSaveProfile = async () => {
    if (!editedCandidate || !candidate) return

    try {
      const updatedCandidate = await candidatesApi.updateCandidate(candidate.id, {
        name: editedCandidate.name,
        email: editedCandidate.email,
        profile: {
          bio: editedCandidate.bio,
          location: editedCandidate.location,
          skills: editedCandidate.skills.split(',').map(skill => skill.trim())
        }
      })
      
      setCandidate(updatedCandidate)
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Failed to update candidate profile:', error)
      // TODO: Add user-friendly error handling
    }
  }

  if (loading) return <div>Loading candidate profile...</div>
  if (error) return <div>Error: {error}</div>
  if (!candidate) return <div>No candidate found</div>

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/candidates" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
          Back to Candidates
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEditProfile}>Edit Profile</DropdownMenuItem>
            <DropdownMenuItem>Download Resume</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Reject Candidate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{candidate.name}</h2>
            <p className="text-muted-foreground">
              {candidate.applications?.[0]?.job?.title || 'No Job Application'}
            </p>
            <div className="mt-4 flex gap-2">
              <Badge variant="outline" className={getStatusColor(candidate.applications?.[0]?.status || 'Unknown')}>
                {candidate.applications?.[0]?.status || 'Unknown'}
              </Badge>
            </div>
            <div className="mt-6 w-full space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.email}</span>
              </div>
              {candidate.profile?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.profile.location}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link 
              href={`/candidates/${candidate.id}/schedule`} 
              className="w-full mr-2"
              onClick={() => console.log(`Navigating to schedule page for candidate: ${candidate.id}`)}
            >
              <Button variant="outline" className="w-full">Schedule Interview</Button>
            </Link>
            <Button className="w-full">Send Message</Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="profile">
            <TabsList className="w-full">
              <TabsTrigger value="profile" className="w-full">Profile</TabsTrigger>
              <TabsTrigger value="applications" className="w-full">Applications</TabsTrigger>
              <TabsTrigger value="interviews" className="w-full">Interviews</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                  <CardDescription>Professional summary and background</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{candidate.profile?.bio || 'No bio available'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {candidate.profile?.skills?.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>{skill}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="applications" className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Applications</h3>
                <span className="text-sm text-muted-foreground">
                  Total Applications: {candidate.applications.length}
                </span>
              </div>
              {candidate.applications.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <CardTitle>{app.job.title}</CardTitle>
                    <CardDescription>{app.job.company}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className={getStatusColor(app.status)}>
                        {app.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {app.createdAt 
                          ? format(parseISO(app.createdAt), 'PP') 
                          : 'Date not available'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="interviews" className="space-y-6">
              {candidate.applications.flatMap(app => 
                app.interviews?.map(interview => (
                  <Card key={interview.id}>
                    <CardHeader>
                      <CardTitle>{interview.interviewType}</CardTitle>
                      <CardDescription>{app.job.title}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className={getStatusColor(interview.status)}>
                          {interview.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {interview.date 
                            ? format(parseISO(interview.date), 'PP') 
                            : 'Date not available'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )) || []
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Candidate Profile</DialogTitle>
            <DialogDescription>
              Make changes to the candidate's profile. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input 
                id="name" 
                value={editedCandidate?.name || ''} 
                className="col-span-3" 
                onChange={(e) => setEditedCandidate(prev => prev ? {...prev, name: e.target.value} : null)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input 
                id="email" 
                value={editedCandidate?.email || ''} 
                className="col-span-3" 
                onChange={(e) => setEditedCandidate(prev => prev ? {...prev, email: e.target.value} : null)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input 
                id="location" 
                value={editedCandidate?.location || ''} 
                className="col-span-3" 
                onChange={(e) => setEditedCandidate(prev => prev ? {...prev, location: e.target.value} : null)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skills" className="text-right">
                Skills
              </Label>
              <Input 
                id="skills" 
                value={editedCandidate?.skills || ''} 
                className="col-span-3" 
                placeholder="Enter skills, separated by commas"
                onChange={(e) => setEditedCandidate(prev => prev ? {...prev, skills: e.target.value} : null)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Textarea 
                id="bio" 
                value={editedCandidate?.bio || ''} 
                className="col-span-3" 
                onChange={(e) => setEditedCandidate(prev => prev ? {...prev, bio: e.target.value} : null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveProfile}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
