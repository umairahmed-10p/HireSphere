import { MapPin, MoreHorizontal, Users, Eye } from "lucide-react"
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

export interface RoleCardProps {
  id: string
  title: string
  department: string
  location: string
  status: string
  applicants: number
  posted: string
  description?: string
}

export function RoleCard({
  id,
  title, 
  department, 
  location, 
  status, 
  applicants, 
  posted,
  description
}: RoleCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return 'bg-green-100 text-green-800'
      case 'CLOSED':
        return 'bg-red-100 text-red-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'FILLED':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/roles/${id}`}>
              <CardTitle className="text-lg hover:underline">{title}</CardTitle>
            </Link>
            <CardDescription className="mt-1">{department}</CardDescription>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {description && <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{applicants} Applicants</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Badge className={`${getStatusColor(status)} capitalize`}>
            {status.toLowerCase()}
          </Badge>
          <Link href={`/roles/${id}`}>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
            >
              <Eye className="mr-2 h-4 w-4" /> View Details
            </Button>
          </Link>
        </div>
        <span className="text-xs text-muted-foreground">{posted}</span>
      </CardFooter>
    </Card>
  )
}
