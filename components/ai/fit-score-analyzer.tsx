"use client"

import { useState } from "react"
import { Check, Loader2, ThumbsUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface FitAnalysis {
  score: number
  strengths: string[]
  gaps: string[]
  recommendations: string[]
}

export function FitScoreAnalyzer() {
  const [jobDescription, setJobDescription] = useState("")
  const [candidateProfile, setCandidateProfile] = useState("")
  const [fitAnalysis, setFitAnalysis] = useState<FitAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyzeFit = async () => {
    if (!jobDescription.trim() || !candidateProfile.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both job description and candidate profile.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/analyze-fit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription, candidateProfile }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze fit")
      }

      const data = await response.json()
      setFitAnalysis(data.fitAnalysis)
      toast({
        title: "Fit analysis complete",
        description: `Candidate has a ${data.fitAnalysis.score}% fit score for this role.`,
      })
    } catch (error) {
      console.error("Error analyzing fit:", error)
      toast({
        title: "Error analyzing fit",
        description: "There was an error analyzing the candidate fit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreText = (score: number) => {
    if (score >= 80) return "Excellent Match"
    if (score >= 60) return "Good Match"
    if (score >= 40) return "Moderate Match"
    return "Low Match"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Fit Score Analyzer</CardTitle>
          <CardDescription>Analyze how well a candidate matches a job description using AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="job-description" className="text-sm font-medium">
              Job Description
            </label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here..."
              className="min-h-[150px]"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="candidate-profile" className="text-sm font-medium">
              Candidate Profile
            </label>
            <Textarea
              id="candidate-profile"
              placeholder="Paste the candidate's resume or profile information here..."
              className="min-h-[150px]"
              value={candidateProfile}
              onChange={(e) => setCandidateProfile(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalyzeFit} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Fit...
              </>
            ) : (
              <>
                <ThumbsUp className="mr-2 h-4 w-4" />
                Analyze Fit
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {fitAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>Fit Analysis Results</CardTitle>
            <CardDescription>AI-generated analysis of candidate fit for this role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-medium">Overall Fit Score</h3>
              <div className="relative mx-auto h-32 w-32">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(fitAnalysis.score)}`}>{fitAnalysis.score}%</span>
                  <span className="text-sm text-muted-foreground">{getScoreText(fitAnalysis.score)}</span>
                </div>
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="stroke-muted-foreground/20"
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    className={`${
                      fitAnalysis.score >= 80
                        ? "stroke-green-500"
                        : fitAnalysis.score >= 60
                          ? "stroke-yellow-500"
                          : "stroke-red-500"
                    }`}
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - fitAnalysis.score / 100)}`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Key Strengths</h3>
              <div className="space-y-2">
                {fitAnalysis.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Development Areas</h3>
              <div className="space-y-2">
                {fitAnalysis.gaps.map((gap, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <X className="mt-0.5 h-4 w-4 text-red-600 flex-shrink-0" />
                    <span>{gap}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Recommendations</h3>
              <ul className="list-inside list-disc space-y-1">
                {fitAnalysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Save Analysis to Candidate Profile
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
