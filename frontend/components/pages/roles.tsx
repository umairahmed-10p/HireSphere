"use client"

import { useState, useEffect } from "react"
import { BriefcaseBusiness, ChevronDown, Filter, Plus, Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoleCard } from "@/components/role-card"
import { PageHeader } from "@/components/shared/page-header"
import { jobsApi, Job } from "@/lib/api/jobs"

export function Roles() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await jobsApi.getJobs()
        setJobs(response.jobs)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch jobs')
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const departments = Array.from(new Set(jobs.map(job => job.department || 'Unspecified')))
  const statuses = ['OPEN', 'CLOSED', 'IN_PROGRESS', 'FILLED', 'CANCELLED']

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartments.length === 0 || 
                               selectedDepartments.includes(job.department || 'Unspecified')
    const matchesStatus = !selectedStatus || job.status === selectedStatus

    return matchesSearch && matchesDepartment && matchesStatus
  })

  if (loading) return <div>Loading jobs...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Job Openings" 
        description="Explore exciting opportunities at our company" 
      />

      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search jobs..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" /> Departments
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select Departments</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {departments.map(dept => (
              <DropdownMenuCheckboxItem
                key={dept}
                checked={selectedDepartments.includes(dept)}
                onCheckedChange={(checked) => {
                  setSelectedDepartments(prev => 
                    checked 
                      ? [...prev, dept] 
                      : prev.filter(d => d !== dept)
                  )
                }}
              >
                {dept}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Status
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statuses.map(status => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={selectedStatus === status}
                onCheckedChange={(checked) => {
                  setSelectedStatus(checked ? status : null)
                }}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href="/create-job">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Job
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map(job => (
          <RoleCard 
            key={job.id}
            id={job.id}
            title={job.title}
            department={job.department || 'Unspecified'}
            location={job.location}
            status={job.status}
            applicants={job.numberOfApplicants || 0}
            posted={new Date(job.createdAt).toLocaleDateString()}
            description={job.description}
          />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No jobs found matching your criteria.
        </div>
      )}
    </div>
  )
}
