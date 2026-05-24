import { redirect } from "next/navigation"
import { getSessionUserAction } from "../perfil/actions"
import { getUserAddressesAction } from "./actions"
import { DireccionesContent } from "./DireccionesContent"

export default async function DireccionesPage() {
  const user = await getSessionUserAction()
  if (!user) redirect("/login")

  const addresses = await getUserAddressesAction()

  return <DireccionesContent addresses={addresses} />
}
