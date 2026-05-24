import { redirect } from "next/navigation"
import { getSessionUserAction } from "./actions"
import { PerfilContent } from "./PerfilContent"

export default async function PerfilPage() {
  const user = await getSessionUserAction()
  if (!user) redirect("/login")

  return <PerfilContent user={user} />
}
