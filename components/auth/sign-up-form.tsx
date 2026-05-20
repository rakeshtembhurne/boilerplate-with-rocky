"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { signUpSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Icons } from "@/components/shared/icons"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    setIsLoading(true)

    try {
      // Sign up - better-auth uses sign-up endpoint
      const result = await authClient.signUp.email({
        email: data.email.toLowerCase(),
        password: data.password,
        name: data.name,
      })

      if (result.error) {
        toast.error("Sign up failed", {
          description: result.error.message || "Could not create account. Please try again.",
        })
        setIsLoading(false)
        return
      }

      toast.success("Account created!", {
        description: "Your account has been created successfully.",
      })
      
      // Navigate to dashboard
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
      setIsLoading(false)
    }
  }

  async function onGoogleSignIn() {
    setIsGoogleLoading(true)

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: searchParams?.get("from") || "/dashboard",
      })

      if (result?.error) {
        toast.error("Sign in failed", {
          description: result.error.message || "Google sign in failed.",
        })
        setIsGoogleLoading(false)
        return
      }

      toast.success("Welcome!", {
        description: "You have been successfully signed in with Google.",
      })
      
      const redirectTo = searchParams?.get("from") || "/dashboard"
      router.push(redirectTo)
    } catch (error) {
      toast.error("Something went wrong", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              autoCapitalize="none"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register("name")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              disabled={isLoading || isGoogleLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <button type="submit" className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Create Account
          </button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={onGoogleSignIn}
        disabled={isLoading || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 size-4" />
        )}{" "}
        Google
      </button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          Already have an account?{" "}
        </span>
        <Link
          href="/auth/sign-in"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
