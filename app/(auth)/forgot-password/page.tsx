import Link from "next/link"
import { Suspense } from "react"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { Icons } from "@/components/shared/icons"
import { BrandName } from "@/components/layout/brand-name"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-6 text-center">
        {/* Branding */}
        <div className="flex flex-col items-center space-y-2">
          <Link href="/" className="flex items-center space-x-1.5">
            <Icons.logo className="size-6" />
            <BrandName className="text-xl font-bold" />
          </Link>
        </div>

        <Suspense fallback={<div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}