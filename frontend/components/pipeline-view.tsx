"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

// Sample pipeline data
const pipelineStages = [
  {
    id: "applied",
    name: "Applied",
    candidates: [
      {
        id: "1",
        name: "Alex Johnson",
        role: "Senior Frontend Developer",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AJ",
        date: "2 days ago",
        tags: ["React", "TypeScript"],
      },
      {
        id: "2",
        name: "Sarah Williams",
        role: "Senior Frontend Developer",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SW",
        date: "3 days ago",
        tags: ["Vue", "JavaScript"],
      },
      {
        id: "3",
        name: "Michael Chen",
        role: "Senior Frontend Developer",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "MC",
        date: "5 days ago",
        tags: ["React", "Next.js"],
      },
    ],
  },
  {
    id: "screening",
    name: "HR Screening",
    candidates: [
      {
        id: "4",
        name: "Emily Rodriguez",
        role: "Senior Frontend Developer",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "ER",
        date: "1 week ago",
        tags: ["React", "CSS"],
      },
      {
        id: "5",
        name: "David Lee",
        role: "Senior Frontend Developer",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "DL",
        date: "1 week ago",
        tags: ["Angular", "TypeScript"],
      },
    ],
  },
  {
    id: "interview",
    name: "Technical Interview",
    candidates: [
      {
        id: "6",
        name: "Lisa Wong",
        role: "Senior Frontend Developer",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "LW",
        date: "2 weeks ago",
        tags: ["React", "Redux"],
      },
    ],
  },
  {
    id: "assessment",
    name: "Assessment",
    candidates: [],
  },
  {
    id: "offer",
    name: "Offer",
    candidates: [
      {
        id: "7",
        name: "James Taylor",
        role: "Senior Frontend Developer",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JT",
        date: "3 weeks ago",
        tags: ["React", "TypeScript"],
      },
    ],
  },
]

interface PipelineViewProps {
  roleId: string
}

export function PipelineView({ roleId }: PipelineViewProps) {
  const [pipeline, setPipeline] = useState(pipelineStages)

  // In a real app, this would use a proper drag and drop library
  const handleDragStart = (e: React.DragEvent, candidateId: string, stageId: string) => {
    e.dataTransfer.setData("candidateId", candidateId)
    e.dataTransfer.setData("stageId", stageId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault()
    const candidateId = e.dataTransfer.getData("candidateId")
    const sourceStageId = e.dataTransfer.getData("stageId")

    if (sourceStageId === targetStageId) return

    const newPipeline = [...pipeline]

    // Find the candidate in the source stage
    const sourceStageIndex = newPipeline.findIndex((stage) => stage.id === sourceStageId)
    const candidateIndex = newPipeline[sourceStageIndex].candidates.findIndex(
      (candidate) => candidate.id === candidateId,
    )

    if (candidateIndex === -1) return

    // Remove the candidate from the source stage
    const [candidate] = newPipeline[sourceStageIndex].candidates.splice(candidateIndex, 1)

    // Add the candidate to the target stage
    const targetStageIndex = newPipeline.findIndex((stage) => stage.id === targetStageId)
    newPipeline[targetStageIndex].candidates.push(candidate)

    setPipeline(newPipeline)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {pipeline.map((stage) => (
        <div key={stage.id} className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-medium">{stage.name}</h4>
            <Badge variant="outline">{stage.candidates.length}</Badge>
          </div>
          <Card className="flex-1" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, stage.id)}>
            <CardContent className="p-2 min-h-[400px]">
              {stage.candidates.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-md border border-dashed p-4">
                  <p className="text-sm text-muted-foreground text-center">No candidates in this stage</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {stage.candidates.map((candidate) => (
                    <Card
                      key={candidate.id}
                      className="cursor-move"
                      draggable
                      onDragStart={(e) => handleDragStart(e, candidate.id, stage.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={candidate.avatar} alt={candidate.name} />
                            <AvatarFallback>{candidate.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{candidate.name}</p>
                            <p className="text-xs text-muted-foreground">{candidate.date}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {candidate.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-2 flex justify-end">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/candidates/${candidate.id}`}>View</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
