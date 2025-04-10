import { MapPin, MoreHorizontal, Users } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Role {
  id: string
  title: string
  department: string
  location: string
  status: string
  applicants: number
  posted: string
  description: string
}

interface RoleCardProps {
  role: Role
}

export function RoleCard({ role }: RoleCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{role.title}</CardTitle>
            <CardDescription className="mt-1">{role.department}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit role</DropdownMenuItem>
              <DropdownMenuItem>Duplicate role</DropdownMenuItem>
              <DropdownMenuItem>Share role</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                {role.status === "active" ? "Close role" : "Delete role"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={role.status === "active" ? "default" : "secondary"}>
            {role.status === "active" ? "Active" : "Closed"}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="mr-1 h-3 w-3" />
            {role.location}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{role.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-1 h-4 w-4" />
          {role.applicants} applicants
        </div>
        <div className="text-sm text-muted-foreground">Posted {role.posted}</div>
      </CardFooter>
      <CardFooter className="pt-2">
        <Button asChild className="w-full">
          <Link href={`/roles/${role.id}`}>View Role</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
