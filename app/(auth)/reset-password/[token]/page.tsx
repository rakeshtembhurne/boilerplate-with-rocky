"use client"

import { Suspense } from "react"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <div className="container mx-auto flex h-screen w-full flex-col items-center justify-center">
      <Suspense fallback={<div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}