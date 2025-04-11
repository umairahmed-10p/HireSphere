import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { role, skills, experience, interviewType } = await request.json()

    if (!role || !interviewType) {
      return NextResponse.json({ error: "Role and interview type are required" }, { status: 400 })
    }

    const prompt = `
      You are an expert technical interviewer. Generate a set of interview questions for a ${role} position.
      
      Interview type: ${interviewType}
      Candidate skills: ${skills || "Not specified"}
      Candidate experience: ${experience || "Not specified"}
      
      Generate 5-8 questions that are appropriate for this interview type and role. For each question, provide:
      1. The question itself
      2. What you're looking to evaluate with this question
      3. Some sample good/bad responses or evaluation criteria
      
      Format the output as a JSON array of objects with these keys: question, evaluation, sampleResponses.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    // Parse the JSON response
    const questions = JSON.parse(text)

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Error generating questions:", error)
    return NextResponse.json({ error: "Failed to generate interview questions" }, { status: 500 })
  }
}
