import { Resend } from "resend";

import { env } from "@/lib/env";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const from = env.FROM_EMAIL ?? "onboarding@resend.dev";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY is not set — skipped "${subject}" to ${to}`,
    );
    return { skipped: true as const };
  }

  const { error } = await resend.emails.send({ from, to, subject, html });
  if (error) throw new Error(error.message);

  return { skipped: false as const };
}

export function resetPasswordEmail(url: string) {
  return `<p>Click the link below to reset your password:</p><p><a href="${url}">Reset password</a></p>`;
}

export function verifyEmailTemplate(url: string) {
  return `<p>Click the link below to verify your email address:</p><p><a href="${url}">Verify email</a></p>`;
}
