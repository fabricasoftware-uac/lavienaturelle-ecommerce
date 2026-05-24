import { redirect } from "next/navigation"
import { getSessionUserAction } from "../perfil/actions"
import { getUserOrdersAction } from "./actions"
import { PedidosContent } from "./PedidosContent"

export default async function PedidosPage() {
  const user = await getSessionUserAction()
  if (!user) redirect("/login")

  const orders = await getUserOrdersAction()

  return <PedidosContent orders={orders} />
}
