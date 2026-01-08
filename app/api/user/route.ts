import { headers } from "next/headers"
import { auth } from "@/lib/auth"

import { prisma } from "@/lib/db"

export async function DELETE(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return new Response("Not authenticated", { status: 401 })
  }

  const currentUser = session.user

  try {
    await prisma.user.delete({
      where: {
        id: currentUser.id,
      },
    })
  } catch (error) {
    return new Response("Internal server error", { status: 500 })
  }

  return new Response("User deleted successfully!", { status: 200 })
}
