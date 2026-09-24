"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/shared/icons"
import { cn } from "@/lib/utils"

type Status = "idle" | "loading" | "success" | "error"

export function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [status, setStatus] = React.useState<Status>("idle")
  const [message, setMessage] = React.useState("")

  React.useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("The verification link is invalid or has expired.")
      return
    }

    let active = true
    setStatus("loading")

    authClient
      .verifyEmail({ query: { token } })
      .then(({ error }) => {
        if (!active) return
        if (error) {
          setStatus("error")
          setMessage(error.message ?? "Verification failed.")
        } else {
          setStatus("success")
          toast.success("Email verified successfully")
          setTimeout(() => router.push("/auth/sign-in"), 1500)
        }
      })
      .catch(() => {
        if (!active) return
        setStatus("error")
        setMessage("Verification failed.")
      })

    return () => {
      active = false
    }
  }, [token, router])

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2 text-center">
        <h1
          className={cn(
            "text-2xl font-semibold tracking-tight",
            status === "error" && "text-red-600",
          )}
        >
          {status === "error"
            ? "Invalid Verification Link"
            : status === "success"
              ? "Email verified"
              : "Verifying your email"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {status === "error"
            ? message
            : status === "success"
              ? "Redirecting you to sign in…"
              : "Please wait while we verify your email address."}
        </p>
      </div>

      {status === "loading" && (
        <div className="flex justify-center">
          <Icons.spinner className="size-8 animate-spin" />
        </div>
      )}

      {status === "error" && (
        <Link href="/auth/sign-in" className={cn(buttonVariants())}>
          Back to sign in
        </Link>
      )}
    </div>
  )
}
