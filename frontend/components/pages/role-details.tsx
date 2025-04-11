"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, Edit, FileText, MapPin, MoreHorizontal, Plus, Share2, Users } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PipelineView } from "@/components/pipeline-view"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample role data
const roleData = {
  id: "1",
  title: "Senior Frontend Developer",
  department: "Engineering",
  location: "Remote",
  status: "active",
  applicants: 24,
  posted: "2 weeks ago",
  description:
    "We're looking for an experienced frontend developer with React expertise to join our engineering team. The ideal candidate will have 5+ years of experience building modern web applications with React, TypeScript, and related technologies.",
  requirements: [
    "5+ years of experience with React and modern JavaScript",
    "Strong TypeScript skills",
    "Experience with state management solutions (Redux, Zustand, etc.)",
    "Understanding of responsive design and cross-browser compatibility",
    "Experience with testing frameworks (Jest, React Testing Library)",
    "Knowledge of modern build tools (Webpack, Vite, etc.)",
  ],
  responsibilities: [
    "Develop new user-facing features using React and TypeScript",
    "Build reusable components and libraries for future use",
    "Optimize applications for maximum performance",
    "Collaborate with backend developers and designers",
    "Participate in code reviews and help maintain code quality",
  ],
  salary: "$120,000 - $150,000",
  team: "Frontend Team",
  hiringManager: "Jane Smith",
}

interface RoleDetailsPageProps {
  id: string
}

export function RoleDetailsPage({ id }: RoleDetailsPageProps) {
  const [activeTab, setActiveTab] = useState("pipeline")

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
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{roleData.title}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{roleData.department}</span>
              <span>•</span>
              <div className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                {roleData.location}
              </div>
              <span>•</span>
              <span>Posted {roleData.posted}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" className="gap-2">
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
          Active
        </Badge>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-1 h-4 w-4" />
          {roleData.applicants} applicants
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          Closing in 30 days
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
                <p className="text-sm text-muted-foreground">{roleData.description}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Requirements</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {roleData.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Responsibilities</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {roleData.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
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
                  <span className="text-sm text-muted-foreground">{roleData.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Location</span>
                  <span className="text-sm text-muted-foreground">{roleData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Salary Range</span>
                  <span className="text-sm text-muted-foreground">{roleData.salary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Team</span>
                  <span className="text-sm text-muted-foreground">{roleData.team}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Hiring Manager</span>
                  <span className="text-sm text-muted-foreground">{roleData.hiringManager}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Application Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Job Description.pdf</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Interview Questions.docx</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Evaluation Form.pdf</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Settings</CardTitle>
              <CardDescription>Configure settings for this role</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Role settings will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
