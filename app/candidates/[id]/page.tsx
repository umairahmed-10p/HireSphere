import { CandidateProfilePage } from "@/components/pages/candidate-profile"

export default function CandidateProfile({ params }: { params: { id: string } }) {
  return <CandidateProfilePage id={params.id} />
}
