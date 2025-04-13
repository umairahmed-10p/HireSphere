"use client"

import { 
  Check, 
  Clock, 
  FileText, 
  Mail, 
  User, 
  Video, 
  X 
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface TimelineStep {
  id: string
  type: 'APPLICATION' | 'SCREENING' | 'INTERVIEW' | 'ASSESSMENT' | 'OFFER' | 'HIRED' | 'REJECTED'
  title: string
  date: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  details?: string
}

export interface HiringTimelineProps {
  candidateId: string
  jobId: string
  steps: TimelineStep[]
}

const getStepIcon = (type: TimelineStep['type']) => {
  switch (type) {
    case 'APPLICATION': return FileText
    case 'SCREENING': return Mail
    case 'INTERVIEW': return Video
    case 'ASSESSMENT': return User
    case 'OFFER': return Check
    case 'HIRED': return Check
    case 'REJECTED': return X
    default: return Clock
  }
}

const getStepColor = (status: TimelineStep['status']) => {
  switch (status) {
    case 'COMPLETED': return 'bg-green-100 text-green-800'
    case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800'
    case 'FAILED': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export function HiringTimeline({ 
  candidateId, 
  jobId, 
  steps 
}: HiringTimelineProps) {
  // Define a predefined set of all possible steps
  const allSteps = [
    { type: 'APPLICATION', title: 'Application' },
    { type: 'SCREENING', title: 'Screening' },
    { type: 'INTERVIEW', title: 'Interview' },
    { type: 'ASSESSMENT', title: 'Assessment' },
    { type: 'OFFER', title: 'Offer' },
    { type: 'HIRED', title: 'Hired' }
  ]

  // Determine the current progress index
  const currentProgressIndex = allSteps.findIndex(
    step => step.type === steps[steps.length - 1].type
  )

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Hiring Process Timeline</CardTitle>
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" /> Candidate Profile
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View full candidate profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="relative w-full min-w-[800px] px-6 py-8">            
            <div className="flex items-start justify-between relative z-10">
              {allSteps.map((stepDef, index) => {
                // Find the corresponding step data or create a default
                const step = steps.find(s => s.type === stepDef.type) || {
                  id: stepDef.type,
                  type: stepDef.type,
                  title: stepDef.title,
                  date: new Date().toISOString(),
                  status: index > currentProgressIndex ? 'PENDING' : 'COMPLETED',
                  details: ''
                }

                const StepIcon = getStepIcon(step.type)
                const isActive = index <= currentProgressIndex
                
                return (
                  <div 
                    key={step.id} 
                    className="flex flex-col items-center flex-1 relative pt-2"
                  >
                    {/* Connector */}
                    {index > 0 && (
                      <div className="absolute top-8 -left-1/2 w-full flex items-center justify-center">
                        <div className="w-full flex items-center justify-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            isActive ? 'bg-blue-400' : 'bg-gray-300'
                          }`} />
                          <div className={`w-2 h-2 rounded-full ${
                            isActive ? 'bg-blue-400' : 'bg-gray-300'
                          }`} />
                          <div className={`w-2 h-2 rounded-full ${
                            isActive ? 'bg-blue-400' : 'bg-gray-300'
                          }`} />
                        </div>
                      </div>
                    )}
                    
                    {/* Step Circle and Icon */}
                    <div 
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center 
                        ${isActive 
                          ? getStepColor(step.status)
                          : 'bg-gray-100 text-gray-400'}
                        relative z-20
                        ${!isActive ? 'opacity-50' : ''}
                        transform transition-transform duration-200 hover:scale-110
                      `}
                    >
                      <StepIcon className="h-6 w-6" />
                      {/* Status Indicator */}
                      <div 
                        className={`
                          absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full 
                          flex items-center justify-center text-xs font-bold
                          border-2 border-white shadow-sm
                          ${
                            isActive ? (
                              step.status === 'COMPLETED' ? 'bg-green-500 text-white' :
                              step.status === 'IN_PROGRESS' ? 'bg-yellow-500 text-white' :
                              step.status === 'FAILED' ? 'bg-red-500 text-white' :
                              'bg-gray-300 text-gray-700'
                            ) : 'bg-gray-300 text-gray-700'
                          }
                        `}
                      >
                        {isActive ? (
                          step.status === 'COMPLETED' ? '✓' : 
                          step.status === 'IN_PROGRESS' ? '...' : 
                          step.status === 'FAILED' ? '✗' : 
                          '?'
                        ) : '?'}
                      </div>
                    </div>
                    
                    {/* Step Details */}
                    <div 
                      className={`
                        text-center mt-4 px-2 w-32 min-h-[100px]
                        flex flex-col items-center
                        ${!isActive ? 'text-gray-400' : ''}
                      `}
                    >
                      <h3 className="text-sm font-semibold mb-1">{stepDef.title}</h3>
                      {isActive && step.date && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(step.date).toLocaleDateString()}
                        </p>
                      )}
                      {isActive && step.details && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="min-h-[60px] w-full flex items-center justify-center">
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-4 cursor-help text-center">
                                  {step.details}
                                </p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{step.details}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/roles/${jobId}`}>
              View Job Details
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/candidates/${candidateId}`}>
              Candidate Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
