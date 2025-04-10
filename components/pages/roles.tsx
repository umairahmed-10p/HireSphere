"use client"

import { useState } from "react"
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

// Sample data
const roles = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    status: "active",
    applicants: 24,
    posted: "2 weeks ago",
    description:
      "We're looking for an experienced frontend developer with React expertise to join our engineering team.",
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    status: "active",
    applicants: 18,
    posted: "1 week ago",
    description: "Join our product team to help define and execute our product roadmap and strategy.",
  },
  {
    id: "3",
    title: "UX Designer",
    department: "Design",
    location: "San Francisco, CA",
    status: "active",
    applicants: 32,
    posted: "3 weeks ago",
    description: "We're seeking a talented UX designer to create intuitive and engaging user experiences.",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    status: "active",
    applicants: 12,
    posted: "4 days ago",
    description: "Help us build and maintain our cloud infrastructure and CI/CD pipelines.",
  },
  {
    id: "5",
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Chicago, IL",
    status: "closed",
    applicants: 45,
    posted: "2 months ago",
    description: "This role is focused on developing and executing marketing campaigns across various channels.",
  },
  {
    id: "6",
    title: "Data Scientist",
    department: "Data",
    location: "Remote",
    status: "closed",
    applicants: 28,
    posted: "1 month ago",
    description: "Join our data team to analyze user behavior and help drive product decisions.",
  },
]

export function RolesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")

  const filteredRoles = roles.filter(
    (role) =>
      role.status === activeTab &&
      (role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.department.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="h-full space-y-6">
      <PageHeader
        title="Roles"
        description="Manage your open positions and job listings"
        actionLabel="Post New Role"
        actionLink="/roles/new"
      />

      <div className="flex flex-col gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search roles..."
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
          <TabsTrigger value="active">Active Roles</TabsTrigger>
          <TabsTrigger value="closed">Closed Roles</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoles.map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="closed" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles
              .filter((role) => role.status === "closed")
              .map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="draft" className="space-y-4 mt-4">
          <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
            <div className="flex flex-col items-center gap-2 text-center">
              <BriefcaseBusiness className="h-10 w-10 text-muted-foreground" />
              <h3 className="text-lg font-medium">No draft roles</h3>
              <p className="text-sm text-muted-foreground max-w-[150px]">You don't have any draft roles yet</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
