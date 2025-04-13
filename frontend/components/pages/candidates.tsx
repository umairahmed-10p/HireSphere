"use client"

import { useState, useEffect } from "react"
import { 
  ChevronDown, 
  Filter, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Users, 
  Activity as Timeline,  
  Clock 
} from "lucide-react"
import Link from 'next/link'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Candidate, candidatesApi } from "@/lib/api/candidates"
import { HiringTimeline } from "@/components/hiring-timeline"
import { AddCandidateForm } from "@/components/forms/add-candidate-form"

export function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("ALL")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCandidates, setExpandedCandidates] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function fetchCandidates() {
      try {
        setLoading(true)
        const fetchedCandidates = activeTab === 'ALL' 
          ? await candidatesApi.getAllCandidates() 
          : await candidatesApi.getCandidates({ 
              applicationStatus: activeTab === 'APPLIED' ? 'APPLIED' : activeTab 
            })
        setCandidates(fetchedCandidates)
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch candidates:', err)
        setError('Failed to load candidates')
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [activeTab])

  useEffect(() => {
    const filtered = candidates.filter(
      (candidate) =>
        (candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (candidate.applications?.[0]?.job?.title || '').toLowerCase().includes(searchQuery.toLowerCase())) &&
        (activeTab === 'ALL' || 
         (activeTab === 'APPLIED' 
          ? candidate.applications?.some(app => app.status === 'APPLIED')
          : candidate.applications?.[0]?.status === activeTab))
    )
    setFilteredCandidates(filtered)
  }, [candidates, searchQuery, activeTab])

  if (loading) return <div>Loading candidates...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="h-full space-y-6">
      <PageHeader
        title="Candidates"
        description="Manage and track all candidates in your pipeline"
      >
        <AddCandidateForm />
      </PageHeader>

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

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => {
          console.log('Tab changed to:', value);
          setActiveTab(value);
        }} 
        defaultValue="ALL"
      >
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="APPLIED">Applied</TabsTrigger>
          <TabsTrigger value="INTERVIEWED">Interviewed</TabsTrigger>
          <TabsTrigger value="OFFERED">Offered</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
        </TabsList>
        {['ALL', 'APPLIED', 'INTERVIEWED', 'OFFERED', 'REJECTED'].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4 mt-4">
            <div className="grid gap-4">
              {filteredCandidates.length === 0 ? (
                <Card>
                  <CardContent className="flex h-[200px] items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Users className="h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No {tab.toLowerCase()} candidates</h3>
                      <p className="text-sm text-muted-foreground max-w-[300px]">
                        {tab === 'ALL' 
                          ? 'Try adjusting your search or filters to find candidates'
                          : `Candidates with ${tab.toLowerCase()} status will appear here`}
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
                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{candidate.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {candidate.applications?.[0]?.job?.title || 'No Job Application'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">
                                {candidate.applications?.[0]?.status || 'Unknown'}
                              </Badge>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  // Toggle timeline visibility for this specific candidate
                                  const newExpandedCandidates = { ...expandedCandidates }
                                  newExpandedCandidates[candidate.id] = !newExpandedCandidates[candidate.id]
                                  setExpandedCandidates(newExpandedCandidates)
                                }}
                              >
                                <Timeline className="mr-2 h-4 w-4" /> View Timeline
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/candidates/${candidate.id}`}>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </Link>
                          <Link href={`/candidates/${candidate.id}/schedule`}>
                            <Button size="sm">
                              Schedule Interview
                            </Button>
                          </Link>
                        </div>
                      </div>
                      {expandedCandidates[candidate.id] && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <HiringTimeline 
                            candidateId={candidate.id} 
                            jobId={candidate.applications?.[0]?.job?.id || ''} 
                            steps={[
                              {
                                id: '1',
                                type: 'APPLICATION',
                                title: 'Application Submitted',
                                date: candidate.applications?.[0]?.createdAt || new Date().toISOString(),
                                status: 'COMPLETED',
                                details: `Applied for ${candidate.applications?.[0]?.job?.title || 'Job Role'}`
                              },
                              // Add more steps based on candidate's application status
                              {
                                id: '2',
                                type: 'SCREENING',
                                title: 'Initial Screening',
                                date: new Date().toISOString(),
                                status: candidate.applications?.[0]?.status === 'SCREENING' 
                                  ? 'IN_PROGRESS' 
                                  : candidate.applications?.[0]?.status === 'APPLIED' 
                                    ? 'PENDING' 
                                    : 'COMPLETED',
                                details: 'HR initial review'
                              },
                              // More steps can be dynamically added based on application status
                            ]} 
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
