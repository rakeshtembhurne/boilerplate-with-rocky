"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { signInSchema } from "@/lib/validations/auth";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/shared/icons";

const emailSchema = z.string().email("Please enter a valid email address.");

type SignInMode = "password" | "otp";

export function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [mode, setMode] = React.useState<SignInMode>("password");
  const [otpStep, setOtpStep] = React.useState<"email" | "code">("email");
  const [otpEmail, setOtpEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const redirectTo = searchParams?.get("from") || "/dashboard";
  const isBusy = isLoading || isGoogleLoading;

  function changeMode(nextMode: SignInMode) {
    setMode(nextMode);
    setOtpStep("email");
    setOtp("");
    setOtpEmail("");
  }

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: data.email.toLowerCase(),
        password: data.password,
      });

      if (result.error) {
        toast.error("Sign in failed", {
          description: result.error.message || "Invalid email or password.",
        });
        return;
      }

      toast.success("Welcome back!", {
        description: "You are now signed in.",
      });
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function sendOtp() {
    const result = emailSchema.safeParse(otpEmail);

    if (!result.success) {
      toast.error("Enter a valid email", {
        description: result.error.issues[0]?.message,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authClient.emailOtp.sendVerificationOtp({
        email: result.data.toLowerCase(),
        type: "sign-in",
      });

      if (response.error) {
        toast.error("Could not send code", {
          description: response.error.message || "Please try again.",
        });
        return;
      }

      setOtpEmail(result.data.toLowerCase());
      setOtpStep("code");
      toast.success("Check your email", {
        description: "We sent a one-time sign-in code.",
      });
    } catch (error) {
      toast.error("Could not send code", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function requestOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendOtp();
  }

  async function verifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter the 6-digit code", {
        description: "Check the code from your email and try again.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await authClient.signIn.emailOtp({
        email: otpEmail,
        otp,
      });

      if (result.error) {
        toast.error("That code did not work", {
          description:
            result.error.message || "Request a new code and try again.",
        });
        return;
      }

      toast.success("Welcome back!", {
        description: "You are now signed in.",
      });
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onGoogleSignIn() {
    setIsGoogleLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });

      if (result?.error) {
        toast.error("Sign in failed", {
          description: result.error.message || "Google sign in failed.",
        });
        return;
      }

      toast.success("Welcome!", {
        description: "You have been successfully signed in with Google.",
      });
      router.push(redirectTo);
    } catch (error) {
      toast.error("Something went wrong", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col space-y-5">
      <div className="bg-muted grid grid-cols-2 gap-2 rounded-lg p-1">
        <button
          type="button"
          className={cn(
            buttonVariants({
              variant: mode === "password" ? "secondary" : "ghost",
            }),
            "w-full",
          )}
          onClick={() => changeMode("password")}
          disabled={isBusy}
        >
          Password
        </button>
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: mode === "otp" ? "secondary" : "ghost" }),
            "w-full",
          )}
          onClick={() => changeMode("otp")}
          disabled={isBusy}
        >
          Email code
        </button>
      </div>

      {mode === "password" ? (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isBusy}
                  {...register("email")}
                />
                {errors?.email ? (
                  <p className="text-destructive px-1 text-xs">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  disabled={isBusy}
                  {...register("password")}
                />
                {errors?.password ? (
                  <p className="text-destructive px-1 text-xs">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>
              <button
                type="submit"
                className={cn(buttonVariants())}
                disabled={isBusy}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                ) : null}
                Sign in
              </button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            className={cn(buttonVariants({ variant: "outline" }))}
            onClick={onGoogleSignIn}
            disabled={isBusy}
          >
            {isGoogleLoading ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 size-4" />
            )}
            Google
          </button>
        </>
      ) : otpStep === "email" ? (
        <form onSubmit={requestOtp} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="otp-email">Email</Label>
            <Input
              id="otp-email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={otpEmail}
              onChange={(event) => setOtpEmail(event.target.value)}
              disabled={isBusy}
              autoFocus
            />
          </div>
          <button
            type="submit"
            className={cn(buttonVariants())}
            disabled={isBusy}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : null}
            Email me a code
          </button>
          <p className="text-muted-foreground text-center text-xs leading-5">
            We will email you a one-time code. In local development, the code is
            printed in the server terminal.
          </p>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="otp">6-digit code</Label>
            <Input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, ""))
              }
              disabled={isBusy}
              autoFocus
            />
            <p className="text-muted-foreground text-xs">Sent to {otpEmail}</p>
          </div>
          <button
            type="submit"
            className={cn(buttonVariants())}
            disabled={isBusy}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : null}
            Verify code
          </button>
          <div className="flex justify-between text-sm">
            <button
              type="button"
              className="text-primary font-medium hover:underline"
              onClick={() => setOtpStep("email")}
              disabled={isBusy}
            >
              Use a different email
            </button>
            <button
              type="button"
              className="text-primary font-medium hover:underline"
              onClick={() => void sendOtp()}
              disabled={isBusy}
            >
              Resend code
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2 text-center text-sm">
        <p className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="text-primary font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
        <Link
          href="/auth/forgot-password"
          className="text-primary font-medium hover:underline"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
