"use client"

import React, { useState, useEffect } from 'react'
import { candidatesApi } from '@/lib/api/candidates'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

// Define the type for pipeline stages
interface PipelineStage {
  id: string;
  name: string;
  candidates: PipelineCandidate[];
}

// Define the type for candidates in the pipeline
interface PipelineCandidate {
  id: string;
  name: string;
  role: string;
  avatar: string;
  initials: string;
  date: string;
  tags: string[];
  currentStage: string;
  applications: Array<{
    id: string;
    job: {
      id: string;
      title: string;
    };
    status: string;
    createdAt: string;
  }>;
}

// Initial pipeline stages with empty candidates
const pipelineStages: PipelineStage[] = [
  { id: "applied", name: "Applied", candidates: [] },
  { id: "screening", name: "HR Screening", candidates: [] },
  { id: "interview", name: "Technical Interview", candidates: [] },
  { id: "assessment", name: "Assessment", candidates: [] },
  { id: "offer", name: "Offer", candidates: [] },
  { id: "rejected", name: "Rejected", candidates: [] },
]

interface PipelineViewProps {
  roleId: string
}

const stageBackgroundColors: Record<string, string> = {
  'APPLIED': 'bg-blue-100 dark:bg-blue-800/30 border-blue-200 dark:border-blue-700',
  'SCREENING': 'bg-yellow-100 dark:bg-yellow-800/30 border-yellow-200 dark:border-yellow-700',
  'INTERVIEW': 'bg-green-100 dark:bg-green-800/30 border-green-200 dark:border-green-700',
  'ASSESSMENT': 'bg-purple-100 dark:bg-purple-800/30 border-purple-200 dark:border-purple-700',
  'OFFER': 'bg-teal-100 dark:bg-teal-800/30 border-teal-200 dark:border-teal-700',
  'HIRED': 'bg-emerald-100 dark:bg-emerald-800/30 border-emerald-200 dark:border-emerald-700',
  'REJECTED': 'bg-red-100 dark:bg-red-800/30 border-red-200 dark:border-red-700'
};

const stageBorderColors: Record<string, string> = {
  applied: 'border-blue-200 dark:border-blue-800',
  screening: 'border-yellow-200 dark:border-yellow-800',
  interview: 'border-green-200 dark:border-green-800',
  assessment: 'border-purple-200 dark:border-purple-800',
  offer: 'border-teal-200 dark:border-teal-800',
  hired: 'border-emerald-200 dark:border-emerald-800',
  rejected: 'border-red-200 dark:border-red-800'
}

const stageBadgeColors: Record<string, string> = {
  applied: 'bg-blue-100 text-blue-800',
  screening: 'bg-yellow-100 text-yellow-800',
  interview: 'bg-green-100 text-green-800',
  assessment: 'bg-purple-100 text-purple-800',
  offer: 'bg-teal-100 text-teal-800',
  hired: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800'
}

const candidateCardColors: Record<string, string> = {
  'APPLIED': 'bg-blue-50 dark:bg-blue-800/20 hover:bg-blue-100 dark:hover:bg-blue-800/40',
  'SCREENING': 'bg-yellow-50 dark:bg-yellow-800/20 hover:bg-yellow-100 dark:hover:bg-yellow-800/40',
  'INTERVIEW': 'bg-green-50 dark:bg-green-800/20 hover:bg-green-100 dark:hover:bg-green-800/40',
  'ASSESSMENT': 'bg-purple-50 dark:bg-purple-800/20 hover:bg-purple-100 dark:hover:bg-purple-800/40',
  'OFFER': 'bg-teal-50 dark:bg-teal-800/20 hover:bg-teal-100 dark:hover:bg-teal-800/40',
  'HIRED': 'bg-emerald-50 dark:bg-emerald-800/20 hover:bg-emerald-100 dark:hover:bg-emerald-800/40',
  'REJECTED': 'bg-red-50 dark:bg-red-800/20 hover:bg-red-100 dark:hover:bg-red-800/40'
};

// Add a fallback function to handle potential case mismatches
const getCardColor = (stage: string) => {
  const normalizedStage = stage.toUpperCase();
  return candidateCardColors[normalizedStage] || 'bg-gray-50 dark:bg-gray-800/20';
};

// Add a function to get card color based on stage background
const getCardColorByStage = (stage: string) => {
  const stageColors: Record<string, string> = {
    'APPLIED': 'bg-blue-50 dark:bg-blue-800/20 hover:bg-blue-100 dark:hover:bg-blue-800/40',
    'SCREENING': 'bg-yellow-50 dark:bg-yellow-800/20 hover:bg-yellow-100 dark:hover:bg-yellow-800/40',
    'INTERVIEW': 'bg-green-50 dark:bg-green-800/20 hover:bg-green-100 dark:hover:bg-green-800/40',
    'ASSESSMENT': 'bg-purple-50 dark:bg-purple-800/20 hover:bg-purple-100 dark:hover:bg-purple-800/40',
    'OFFER': 'bg-teal-50 dark:bg-teal-800/20 hover:bg-teal-100 dark:hover:bg-teal-800/40',
    'HIRED': 'bg-emerald-50 dark:bg-emerald-800/20 hover:bg-emerald-100 dark:hover:bg-emerald-800/40',
    'REJECTED': 'bg-red-50 dark:bg-red-800/20 hover:bg-red-100 dark:hover:bg-red-800/40'
  };

  const normalizedStage = stage.toUpperCase();
  return stageColors[normalizedStage] || 'bg-gray-50 dark:bg-gray-800/20';
};

export function PipelineView({ roleId }: PipelineViewProps) {
  const [pipeline, setPipeline] = useState<PipelineStage[]>(pipelineStages)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true)
        const candidates = await candidatesApi.getCandidatesByJobId(roleId)
        console.log("candidates:", candidates);

        // Transform candidates to match existing pipeline structure
        const transformedPipeline = pipelineStages.map(stage => ({
          ...stage,
          candidates: candidates
            .filter(candidate => 
              candidate.applications.some(app => 
                app.job.id === roleId && 
                mapStatusToPipelineStage(app.status) === stage.id
              )
            )
            .map(candidate => {
              const application = candidate.applications.find(app => app.job.id === roleId)
              return {
                id: candidate.id,
                name: candidate.name,
                role: application?.job.title || 'N/A',
                avatar: candidate.avatar || "/placeholder.svg?height=40&width=40",
                initials: candidate.initials || 
                  candidate.name.split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase(),
                date: application ? new Date(application.createdAt).toLocaleDateString() : 'N/A',
                tags: application?.tags || [],
                currentStage: application?.currentStage || 'Applied',
                applications: candidate.applications
              }
            })
        }))

        console.log("transformedPipeline:" ,transformedPipeline);
        setPipeline(transformedPipeline)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch candidates:', err)
        setError('Failed to load candidates. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [roleId])

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, candidateId: string, stageId: string) => {
    e.dataTransfer.setData("candidateId", candidateId)
    e.dataTransfer.setData("stageId", stageId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault()
    const candidateId = e.dataTransfer.getData("candidateId")
    const sourceStageId = e.dataTransfer.getData("stageId")

    if (sourceStageId === targetStageId) return

    try {
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

      // Map pipeline stage to backend status
      const stageToStatusMap: Record<string, 'APPLIED' | 'INTERVIEWED' | 'OFFERED' | 'REJECTED' | 'SCREENING' | 'ASSESSMENT'> = {
        'applied': 'APPLIED',
        'screening': 'SCREENING',
        'interview': 'INTERVIEWED',
        'assessment': 'ASSESSMENT',
        'offer': 'OFFERED',
        'rejected': 'REJECTED'
      }

      // Find the application for this job
      const application = candidate.applications?.find(app => app.job.id === roleId)
      
      if (application) {
        // Update candidate status in backend
        await candidatesApi.updateCandidateStatus(
          candidateId, 
          application.id, 
          stageToStatusMap[targetStageId]
        )
      }

      setPipeline(newPipeline)
    } catch (error) {
      console.error('Failed to update candidate status:', error)
      // Optionally, show an error toast or message to the user
    }
  }

  // Helper function to map backend status to pipeline stages
  const mapStatusToPipelineStage = (status: string): string => {
    switch(status.toUpperCase()) {
      case 'APPLIED': return 'applied'
      case 'SCREENING': return 'screening'
      case 'INTERVIEWED': return 'interview'
      case 'ASSESSMENT': return 'assessment'
      case 'OFFERED': return 'offer'
      case 'REJECTED': return 'rejected'
      default: return 'applied'
    }
  }

  if (loading) return <div>Loading pipeline...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      {pipeline.map((stage) => (
        <div key={stage.id} className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-medium">{stage.name}</h4>
            <Badge variant="outline" className={stageBadgeColors[stage.id]}>{stage.candidates.length}</Badge>
          </div>
          <Card className={`flex-1 ${stageBackgroundColors[stage.name]} ${stageBorderColors[stage.id]}`} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, stage.id)}>
            <CardContent className="p-2 min-h-[400px]">
              {stage.candidates.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-md border border-dashed p-4">
                  <p className="text-sm text-muted-foreground">No candidates in this stage</p>
                </div>
              ) : (
                stage.candidates.map((candidate) => (
                  <div
                key={candidate.id}
                draggable
                onDragStart={(e) => handleDragStart(e, candidate.id, stage.id)}
                    className={`mb-2 p-2 ${getCardColorByStage(candidate.currentStage)} rounded-md shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                    <div className="flex items-center space-x-3 mb-2">
                    <Avatar>
                      <AvatarImage src={candidate.avatar} alt={candidate.name} />
                      <AvatarFallback>{candidate.initials}</AvatarFallback>
                    </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">{candidate.date}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(candidate.tags || []).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${stageBadgeColors[stage.id]}`}
                      >
                        {candidate.currentStage}
                      </Badge>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/candidates/${candidate.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))
                  )}
                </CardContent>
              </Card>
        </div>
      ))}
    </div>
  )
}
