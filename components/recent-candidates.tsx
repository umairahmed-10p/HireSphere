import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const recentCandidates = [
  {
    id: "1",
    name: "Alex Johnson",
    role: "Senior Frontend Developer",
    stage: "Technical Interview",
    department: "Engineering",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AJ",
    date: "2 days ago",
  },
  {
    id: "2",
    name: "Sarah Williams",
    role: "Product Manager",
    stage: "HR Screening",
    department: "Product",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SW",
    date: "3 days ago",
  },
  {
    id: "3",
    name: "Michael Chen",
    role: "UX Designer",
    stage: "Portfolio Review",
    department: "Design",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MC",
    date: "5 days ago",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    role: "Marketing Specialist",
    stage: "Final Interview",
    department: "Marketing",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ER",
    date: "1 week ago",
  },
]

export function RecentCandidates() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Candidates</CardTitle>
        <CardDescription>Latest candidates that have applied or moved stages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentCandidates.map((candidate) => (
            <div key={candidate.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={candidate.avatar} alt={candidate.name} />
                  <AvatarFallback>{candidate.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{candidate.name}</p>
                  <p className="text-sm text-muted-foreground">{candidate.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{candidate.stage}</Badge>
                    <span className="text-xs text-muted-foreground">{candidate.date}</span>
                  </div>
                </div>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/candidates/${candidate.id}`}>View</Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
