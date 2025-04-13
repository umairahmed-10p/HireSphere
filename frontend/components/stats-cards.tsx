"use client"

import { BarChart3, BriefcaseBusiness, Clock, ThumbsUp, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface StatsData {
  timeToHire: number;
  openRoles: number;
  activeCandidates: number;
  offersSent: {
    total: number;
    accepted: number;
    pending: number;
  };
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData>({
    timeToHire: 0,
    openRoles: 0,
    activeCandidates: 0,
    offersSent: {
      total: 0,
      accepted: 0,
      pending: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3009/api/dashboard/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map(item => (
        <Card key={item}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-2/3 mt-2 bg-gray-200 animate-pulse rounded"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (error) return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="col-span-full">
        <CardContent className="text-center text-red-500 p-4">
          {error}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.timeToHire} days</div>
          <p className="text-xs text-muted-foreground">Average across all departments</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Roles</CardTitle>
          <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.openRoles}</div>
          <p className="text-xs text-muted-foreground">Across departments</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Candidates</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeCandidates}</div>
          <p className="text-xs text-muted-foreground">+{Math.round((stats.activeCandidates / 10) * 100)}% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Offers Sent</CardTitle>
          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.offersSent.total}</div>
          <p className="text-xs text-muted-foreground">{stats.offersSent.accepted} accepted, {stats.offersSent.pending} pending</p>
        </CardContent>
      </Card>
    </div>
  )
}
