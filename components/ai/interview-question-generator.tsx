"use client"

import { useState } from "react"
import { Copy, HelpCircle, Loader2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"

interface Question {
  question: string
  evaluation: string
  sampleResponses: {
    good?: string[]
    bad?: string[]
    criteria?: string[]
  }
}

export function InterviewQuestionGenerator() {
  const [role, setRole] = useState("")
  const [skills, setSkills] = useState("")
  const [experience, setExperience] = useState("")
  const [interviewType, setInterviewType] = useState("technical")
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateQuestions = async () => {
    if (!role) {
      toast({
        title: "Role is required",
        description: "Please enter the role to generate relevant questions.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role, skills, experience, interviewType }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate questions")
      }

      const data = await response.json()
      setQuestions(data.questions)
      toast({
        title: "Questions generated",
        description: `Generated ${data.questions.length} questions for ${interviewType} interview.`,
      })
    } catch (error) {
      console.error("Error generating questions:", error)
      toast({
        title: "Error generating questions",
        description: "There was an error generating the questions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Question copied to clipboard.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Interview Question Generator</CardTitle>
          <CardDescription>Generate tailored interview questions based on role and candidate profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              placeholder="e.g. Senior Frontend Developer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interview-type">Interview Type</Label>
            <Select value={interviewType} onValueChange={setInterviewType}>
              <SelectTrigger id="interview-type">
                <SelectValue placeholder="Select interview type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="behavioral">Behavioral</SelectItem>
                <SelectItem value="cultural-fit">Cultural Fit</SelectItem>
                <SelectItem value="problem-solving">Problem Solving</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">
              Candidate Skills <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="skills"
              placeholder="e.g. React, TypeScript, Node.js"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">
              Candidate Experience <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="experience"
              placeholder="e.g. 5 years of frontend development, led a team of 3 developers"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateQuestions} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Generate Questions
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Questions</CardTitle>
            <CardDescription>
              {questions.length} questions for {interviewType} interview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {questions.map((q, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-start gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {index + 1}
                      </span>
                      <span>{q.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 px-8">
                    <div>
                      <h4 className="flex items-center gap-2 font-medium">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        What to evaluate
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">{q.evaluation}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Sample Responses or Evaluation Criteria</h4>
                      {q.sampleResponses.good && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium text-green-600">Good Responses:</h5>
                          <ul className="mt-1 list-inside list-disc space-y-1 text-sm">
                            {q.sampleResponses.good.map((resp, i) => (
                              <li key={i}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {q.sampleResponses.bad && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium text-red-600">Concerning Responses:</h5>
                          <ul className="mt-1 list-inside list-disc space-y-1 text-sm">
                            {q.sampleResponses.bad.map((resp, i) => (
                              <li key={i}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {q.sampleResponses.criteria && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium">Evaluation Criteria:</h5>
                          <ul className="mt-1 list-inside list-disc space-y-1 text-sm">
                            {q.sampleResponses.criteria.map((criteria, i) => (
                              <li key={i}>{criteria}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <Button variant="outline" size="sm" className="mt-2" onClick={() => copyToClipboard(q.question)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Question
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const text = questions.map((q, i) => `${i + 1}. ${q.question}`).join("\n\n")
                copyToClipboard(text)
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy All Questions
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
