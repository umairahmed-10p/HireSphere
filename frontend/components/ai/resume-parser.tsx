"use client"

import { useState } from "react"
import { FileText, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface ParsedResume {
  contactInfo: {
    name: string
    email: string
    phone: string
    location: string
  }
  skills: string[]
  workExperience: Array<{
    company: string
    title: string
    dates: string
    responsibilities: string[]
  }>
  education: Array<{
    institution: string
    degree: string
    dates: string
  }>
  certifications: string[]
  languages: string[]
}

export function ResumeParser() {
  const [resumeText, setResumeText] = useState("")
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleParseResume = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "Resume text required",
        description: "Please paste the resume text to parse.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/parse-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeText }),
      })

      if (!response.ok) {
        throw new Error("Failed to parse resume")
      }

      const data = await response.json()
      setParsedResume(data.parsedResume)
      toast({
        title: "Resume parsed successfully",
        description: "The resume has been analyzed and key information extracted.",
      })
    } catch (error) {
      console.error("Error parsing resume:", error)
      toast({
        title: "Error parsing resume",
        description: "There was an error parsing the resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Resume Parser</CardTitle>
          <CardDescription>Paste resume text to automatically extract key information using AI</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste resume text here..."
            className="min-h-[200px]"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleParseResume} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Parsing Resume...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Parse Resume
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {parsedResume && (
        <Card>
          <CardHeader>
            <CardTitle>Parsed Resume</CardTitle>
            <CardDescription>Key information extracted from the resume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="mt-2 space-y-1">
                <p>
                  <span className="font-medium">Name:</span> {parsedResume.contactInfo.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {parsedResume.contactInfo.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {parsedResume.contactInfo.phone}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {parsedResume.contactInfo.location}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Skills</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {parsedResume.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Work Experience</h3>
              <div className="mt-2 space-y-4">
                {parsedResume.workExperience.map((exp, index) => (
                  <div key={index} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{exp.title}</h4>
                      <span className="text-sm text-muted-foreground">{exp.dates}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Education</h3>
              <div className="mt-2 space-y-2">
                {parsedResume.education.map((edu, index) => (
                  <div key={index} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{edu.institution}</h4>
                      <span className="text-sm text-muted-foreground">{edu.dates}</span>
                    </div>
                    <p className="text-sm">{edu.degree}</p>
                  </div>
                ))}
              </div>
            </div>

            {parsedResume.certifications.length > 0 && (
              <div>
                <h3 className="text-lg font-medium">Certifications</h3>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  {parsedResume.certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              </div>
            )}

            {parsedResume.languages.length > 0 && (
              <div>
                <h3 className="text-lg font-medium">Languages</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {parsedResume.languages.map((lang, index) => (
                    <span key={index} className="rounded-full bg-secondary px-2.5 py-0.5 text-sm font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Import to Candidate Profile
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
