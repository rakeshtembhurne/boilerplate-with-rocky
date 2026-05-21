import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: ProtectedLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in?from=/admin");
  }

  // Fetch user with role from database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (dbUser?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
