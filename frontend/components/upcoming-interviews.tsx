import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const upcomingInterviews = [
  {
    id: "1",
    candidateName: "Alex Johnson",
    role: "Senior Frontend Developer",
    interviewType: "Technical",
    interviewers: ["Jane Smith", "Mike Brown"],
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AJ",
    date: "Today, 2:00 PM",
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
  },
]

export function UpcomingInterviews() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Interviews</CardTitle>
        <CardDescription>Scheduled interviews for the next few days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingInterviews.map((interview) => (
            <div key={interview.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={interview.avatar} alt={interview.candidateName} />
                  <AvatarFallback>{interview.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{interview.candidateName}</p>
                  <p className="text-sm text-muted-foreground">{interview.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{interview.interviewType}</Badge>
                    <span className="text-xs text-muted-foreground">{interview.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Join
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/interviews/${interview.id}`}>Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
