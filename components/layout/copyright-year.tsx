"use client";

/** Renders the current year on the client to avoid impure values during prerender. */
export function CopyrightYear() {
  return <>{new Date().getFullYear()}</>;
}
