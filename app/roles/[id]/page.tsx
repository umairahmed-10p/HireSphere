import { RoleDetailsPage } from "@/components/pages/role-details"

export default function RoleDetails({ params }: { params: { id: string } }) {
  return <RoleDetailsPage id={params.id} />
}
