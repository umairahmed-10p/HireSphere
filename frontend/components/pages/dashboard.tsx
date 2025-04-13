"use client"

import { BarChart3, BriefcaseBusiness, Calendar, Clock, MessageSquare, Plus, ThumbsUp, Users } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentCandidates } from "@/components/recent-candidates"
import { UpcomingInterviews } from "@/components/upcoming-interviews"
import { StatsCards } from "@/components/stats-cards"
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { jobsApi, Job } from '@/lib/api/jobs'
import { toast } from 'sonner'
import { getCurrentUser } from '@/lib/auth'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between pt-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your hiring pipeline.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/roles/new">
              <Plus className="mr-2 h-4 w-4" />
              Post New Role
            </Link>
          </Button>
        </div>
      </div>

      <StatsCards />

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="interviews">Upcoming Interviews</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
          <RecentCandidates />
        </TabsContent>
        <TabsContent value="interviews" className="space-y-4">
          <UpcomingInterviews />
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Interview
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Feedback
            </Button>
            <Button variant="outline" className="justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hiring Team Performance</CardTitle>
            <CardDescription>Response times and interview completion</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">Performance chart will appear here</div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Detailed Analytics
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
