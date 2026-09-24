"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { userRoleSchema } from "@/lib/validations/user"

export type FormData = {
  role: "ADMIN" | "USER"
}

/**
 * Change a user's role. Admin-only: the caller must be an ADMIN.
 * Intended for an admin user-management surface.
 */
export async function updateUserRole(userId: string, data: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (session?.user?.role !== "ADMIN") {
      throw new Error("Unauthorized")
    }

    const { role } = userRoleSchema.parse(data)

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role,
      },
    })

    revalidatePath("/dashboard/settings")
    return { status: "success" as const }
  } catch {
    return { status: "error" as const }
  }
}
