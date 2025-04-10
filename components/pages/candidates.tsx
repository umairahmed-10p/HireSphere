"use client"

import { useState } from "react"
import { ChevronDown, Filter, Plus, Search, SlidersHorizontal, Users } from "lucide-react"
import Link from "next/link"
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
import { PageHeader } from "@/components/shared/page-header"

// Sample candidate data
const candidates = [
  {
    id: "1",
    name: "Alex Johnson",
    role: "Senior Frontend Developer",
    stage: "Technical Interview",
    department: "Engineering",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AJ",
    appliedDate: "2 days ago",
    skills: ["React", "TypeScript"],
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Williams",
    role: "Product Manager",
    stage: "HR Screening",
    department: "Product",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SW",
    appliedDate: "3 days ago",
    skills: ["Product Strategy", "Agile"],
    status: "active",
  },
  {
    id: "3",
    name: "Michael Chen",
    role: "UX Designer",
    stage: "Portfolio Review",
    department: "Design",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MC",
    appliedDate: "5 days ago",
    skills: ["Figma", "User Research"],
    status: "active",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    role: "Marketing Specialist",
    stage: "Final Interview",
    department: "Marketing",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ER",
    appliedDate: "1 week ago",
    skills: ["Content Marketing", "SEO"],
    status: "active",
  },
  {
    id: "5",
    name: "David Lee",
    role: "DevOps Engineer",
    stage: "Offer",
    department: "Engineering",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "DL",
    appliedDate: "1 week ago",
    skills: ["Kubernetes", "AWS"],
    status: "active",
  },
  {
    id: "6",
    name: "Lisa Wong",
    role: "Data Scientist",
    stage: "Rejected",
    department: "Data",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "LW",
    appliedDate: "2 weeks ago",
    skills: ["Python", "Machine Learning"],
    status: "archived",
  },
  {
    id: "7",
    name: "James Taylor",
    role: "Frontend Developer",
    stage: "Rejected",
    department: "Engineering",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JT",
    appliedDate: "3 weeks ago",
    skills: ["JavaScript", "CSS"],
    status: "archived",
  },
]

export function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.status === activeTab &&
      (candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.department.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="h-full space-y-6">
      <PageHeader
        title="Candidates"
        description="Manage and track all candidates in your pipeline"
        actionLabel="Add Candidate"
        actionLink="/candidates/new"
      />

      <div className="flex flex-col gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search candidates..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                <span>Department</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Engineering</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Product</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Design</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Marketing</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Data</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="flex gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <span>More Filters</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active Candidates</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4 mt-4">
          <div className="grid gap-4">
            {filteredCandidates.length === 0 ? (
              <Card>
                <CardContent className="flex h-[200px] items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Users className="h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No candidates found</h3>
                    <p className="text-sm text-muted-foreground max-w-[300px]">
                      Try adjusting your search or filters to find what you're looking for
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredCandidates.map((candidate) => (
                <Card key={candidate.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={candidate.avatar} alt={candidate.name} />
                          <AvatarFallback>{candidate.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{candidate.name}</h3>
                          <p className="text-sm text-muted-foreground">{candidate.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{candidate.stage}</Badge>
                            <span className="text-xs text-muted-foreground">{candidate.department}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 md:items-end">
                        <div className="text-sm">Applied {candidate.appliedDate}</div>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button asChild>
                        <Link href={`/candidates/${candidate.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="archived" className="space-y-4 mt-4">
          <div className="grid gap-4">
            {candidates
              .filter((candidate) => candidate.status === "archived")
              .map((candidate) => (
                <Card key={candidate.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={candidate.avatar} alt={candidate.name} />
                          <AvatarFallback>{candidate.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{candidate.name}</h3>
                          <p className="text-sm text-muted-foreground">{candidate.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{candidate.stage}</Badge>
                            <span className="text-xs text-muted-foreground">{candidate.department}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 md:items-end">
                        <div className="text-sm">Applied {candidate.appliedDate}</div>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button asChild>
                        <Link href={`/candidates/${candidate.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
