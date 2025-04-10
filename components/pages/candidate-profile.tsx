"use client"

import { useState } from "react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

// Sample candidate data
const candidateData = {
  id: "1",
  name: "Alex Johnson",
  role: "Senior Frontend Developer",
  stage: "Technical Interview",
  department: "Engineering",
  avatar: "/placeholder.svg?height=80&width=80",
  initials: "AJ",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  appliedDate: "May 2, 2023",
  source: "LinkedIn",
  skills: [
    { name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "CSS/SCSS", level: 80 },
    { name: "Node.js", level: 70 },
    { name: "GraphQL", level: 65 },
  ],
  experience: [
    {
      company: "TechCorp Inc.",
      role: "Frontend Developer",
      duration: "2019 - 2023",
      description: "Led the frontend development team in building a modern SaaS platform.",
    },
    {
      company: "WebSolutions LLC",
      role: "UI Developer",
      duration: "2016 - 2019",
      description: "Developed responsive web applications for various clients.",
    },
  ],
  education: [
    {
      institution: "University of California, Berkeley",
      degree: "B.S. Computer Science",
      year: "2012 - 2016",
    },
  ],
  notes: [
    {
      author: "Jane Smith",
      date: "May 10, 2023",
      content: "Alex demonstrated strong React skills during the technical interview. Good problem-solving approach.",
    },
    {
      author: "Mike Brown",
      date: "May 5, 2023",
      content: "Initial screening went well. Candidate has relevant experience and seems enthusiastic about the role.",
    },
  ],
  timeline: [
    {
      date: "May 15, 2023",
      event: "Technical Interview Completed",
      description: "Passed technical interview with Jane Smith and Mike Brown.",
    },
    {
      date: "May 10, 2023",
      event: "Technical Interview Scheduled",
      description: "Scheduled for May 15, 2023 at 2:00 PM.",
    },
    {
      date: "May 5, 2023",
      event: "HR Screening Completed",
      description: "Passed initial screening with HR.",
    },
    {
      date: "May 2, 2023",
      event: "Application Received",
      description: "Applied for Senior Frontend Developer position.",
    },
  ],
  fitScore: 85,
}

interface CandidateProfilePageProps {
  id: string
}

export function CandidateProfilePage({ id }: CandidateProfilePageProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/roles/1">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{candidateData.name}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{candidateData.role}</span>
              <span>•</span>
              <Badge variant="outline">{candidateData.stage}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
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
              <DropdownMenuItem>Move to next stage</DropdownMenuItem>
              <DropdownMenuItem>Send assessment</DropdownMenuItem>
              <DropdownMenuItem>Request references</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Reject candidate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="notes">Interview Notes</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Experience</CardTitle>
                  <CardDescription>Candidate's skills and professional experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Skills</h4>
                    <div className="space-y-4">
                      {candidateData.skills.map((skill) => (
                        <div key={skill.name} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{skill.name}</span>
                            <span className="text-sm text-muted-foreground">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Experience</h4>
                    <div className="space-y-4">
                      {candidateData.experience.map((exp, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{exp.company}</span>
                            <span className="text-sm text-muted-foreground">{exp.duration}</span>
                          </div>
                          <p className="text-sm">{exp.role}</p>
                          <p className="text-sm text-muted-foreground">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Education</h4>
                    <div className="space-y-2">
                      {candidateData.education.map((edu, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{edu.institution}</span>
                            <span className="text-sm text-muted-foreground">{edu.year}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{edu.degree}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notes" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Interview Notes</CardTitle>
                    <CardDescription>Feedback from interviewers</CardDescription>
                  </div>
                  <Button>Add Note</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {candidateData.notes.map((note, index) => (
                    <Card key={index}>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">{note.author}</div>
                          <div className="text-xs text-muted-foreground">{note.date}</div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">{note.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="timeline" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Application Timeline</CardTitle>
                  <CardDescription>History of candidate's application process</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative space-y-4 ml-4 mt-2 pb-2">
                    <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-border" />
                    {candidateData.timeline.map((item, index) => (
                      <div key={index} className="relative pl-6">
                        <div className="absolute left-[-4px] h-3 w-3 rounded-full bg-primary" />
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.event}</span>
                            <span className="text-xs text-muted-foreground">{item.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="documents" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Candidate Documents</CardTitle>
                  <CardDescription>Resume and other submitted documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Resume.pdf</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Cover Letter.pdf</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Portfolio.pdf</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Candidate Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                <Avatar className="h-20 w-20 mb-2">
                  <AvatarImage src={candidateData.avatar} alt={candidateData.name} />
                  <AvatarFallback>{candidateData.initials}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-medium">{candidateData.name}</h3>
                <p className="text-sm text-muted-foreground">{candidateData.role}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{candidateData.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{candidateData.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{candidateData.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Applied: {candidateData.appliedDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>AI Fit Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="relative h-32 w-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{candidateData.fitScore}%</span>
                  </div>
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle
                      className="stroke-muted-foreground/20"
                      cx="50"
                      cy="50"
                      r="40"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      className="stroke-primary"
                      cx="50"
                      cy="50"
                      r="40"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - candidateData.fitScore / 100)}`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Based on skills and experience match</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">Strong React experience</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">TypeScript proficiency</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <X className="mr-2 h-4 w-4 text-red-500" />
                    <span className="text-sm">Limited GraphQL experience</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Full Analysis
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <ThumbsUp className="mr-2 h-4 w-4" />
                Move to Next Stage
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Star className="mr-2 h-4 w-4" />
                Add to Favorites
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
