import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { candidateProfile, jobDescription } = await request.json()

    if (!candidateProfile || !jobDescription) {
      return NextResponse.json({ error: "Candidate profile and job description are required" }, { status: 400 })
    }

    const prompt = `
      You are an expert talent evaluator. Analyze the fit between the candidate profile and job description below.
      
      Job Description:
      ${jobDescription}
      
      Candidate Profile:
      ${candidateProfile}
      
      Provide a comprehensive analysis with the following:
      1. Overall fit score (0-100)
      2. Strengths (list of key strengths that match the job requirements)
      3. Gaps (list of areas where the candidate may need development)
      4. Recommendations (suggestions for interview focus areas or development)
      
      Format the output as a JSON object with these keys: score, strengths, gaps, recommendations.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    // Parse the JSON response
    const fitAnalysis = JSON.parse(text)

    return NextResponse.json({ fitAnalysis })
  } catch (error) {
    console.error("Error analyzing fit:", error)
    return NextResponse.json({ error: "Failed to analyze candidate fit" }, { status: 500 })
  }
}
