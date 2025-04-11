import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { resumeText } = await request.json()

    if (!resumeText) {
      return NextResponse.json({ error: "Resume text is required" }, { status: 400 })
    }

    const prompt = `
      You are an expert resume parser. Extract the following information from the resume text below:
      
      1. Contact Information (name, email, phone, location)
      2. Skills (technical and soft skills)
      3. Work Experience (company names, job titles, dates, and key responsibilities)
      4. Education (institutions, degrees, dates)
      5. Certifications (if any)
      6. Languages (if any)
      
      Format the output as a JSON object with these keys: contactInfo, skills, workExperience, education, certifications, languages.
      
      Resume text:
      ${resumeText}
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    // Parse the JSON response
    const parsedResume = JSON.parse(text)

    return NextResponse.json({ parsedResume })
  } catch (error) {
    console.error("Error parsing resume:", error)
    return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 })
  }
}
