"use client"

import { useState } from "react"
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

// Sample interview data
const interviews = [
  {
    id: "1",
    candidateName: "Alex Johnson",
    role: "Senior Frontend Developer",
    interviewType: "Technical",
    interviewers: ["Jane Smith", "Mike Brown"],
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AJ",
    date: "Today, 2:00 PM",
    status: "upcoming",
  },
  {
    id: "2",
    candidateName: "Sarah Williams",
    role: "Product Manager",
    interviewType: "HR Screening",
    interviewers: ["David Lee"],
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SW",
    date: "Tomorrow, 10:00 AM",
    status: "upcoming",
  },
  {
    id: "3",
    candidateName: "Michael Chen",
    role: "UX Designer",
    interviewType: "Portfolio Review",
    interviewers: ["Lisa Wong", "James Taylor"],
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MC",
    date: "May 10, 3:30 PM",
    status: "upcoming",
  },
  {
    id: "4",
    candidateName: "Emily Rodriguez",
    role: "Marketing Specialist",
    interviewType: "Final Interview",
    interviewers: ["John Davis", "Sarah Miller"],
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ER",
    date: "May 5, 11:00 AM",
    status: "completed",
  },
  {
    id: "5",
    candidateName: "David Lee",
    role: "DevOps Engineer",
    interviewType: "Technical",
    interviewers: ["Mike Brown", "Chris Wilson"],
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "DL",
    date: "May 3, 2:30 PM",
    status: "completed",
  },
]

export function InterviewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")

  const filteredInterviews = interviews.filter(
    (interview) =>
      interview.status === activeTab &&
      (interview.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interview.role.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="h-full space-y-6">
      <PageHeader
        title="Interviews"
        description="Manage and schedule candidate interviews"
        actionLabel="Schedule Interview"
        actionLink="/interviews/schedule"
      />

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

        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-4">
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
                        <AvatarImage src={interview.avatar} alt={interview.candidateName} />
                        <AvatarFallback>{interview.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{interview.candidateName}</h3>
                          <Badge variant="secondary" className="pointer-events-none">
                            {interview.interviewType}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{interview.role}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{interview.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>45 minutes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>With:</span>
                            <span>{interview.interviewers.join(", ")}</span>
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
          <TabsContent value="completed" className="mt-4">
            <div className="grid gap-4">
              {interviews
                .filter((interview) => interview.status === "completed")
                .map((interview) => (
                  <Card key={interview.id}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={interview.avatar} alt={interview.candidateName} />
                        <AvatarFallback>{interview.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{interview.candidateName}</h3>
                          <Badge variant="secondary" className="pointer-events-none">
                            {interview.interviewType}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{interview.role}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{interview.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>45 minutes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>With:</span>
                            <span>{interview.interviewers.join(", ")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline">View Feedback</Button>
                        <Button asChild>
                          <Link href={`/interviews/${interview.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
