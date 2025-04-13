import { ScheduleInterviewPage } from "@/components/pages/schedule-interview"
import { Candidate, candidatesApi } from "@/lib/api/candidates"

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const candidate: Candidate = await candidatesApi.getCandidateById(params.id)
    return {
      title: `Schedule Interview - ${candidate.name}`
    }
  } catch (error) {
    return {
      title: `Schedule Interview`
    }
  }
}

export default async function ScheduleInterview({ params }: { params: { id: string } }) {
  console.log("Schedule Interview Page - Candidate ID:", params.id)
  return <ScheduleInterviewPage candidateId={params.id} />
}
