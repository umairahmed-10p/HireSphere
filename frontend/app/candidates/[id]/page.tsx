import { CandidateProfilePage } from "@/components/pages/candidate-profile"

export default async function CandidateProfile({ params }: { params: { id: string } }) {
  console.log("Page ID:", params.id)
  return <CandidateProfilePage id={params.id} />
}
