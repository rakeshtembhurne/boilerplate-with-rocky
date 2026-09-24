import { describe, expect, test } from "bun:test";

import {
  DEFAULT_EMAIL_OTP_TEST_CODE,
  getDevelopmentOtpCode,
} from "../lib/email-otp";

describe("development email OTP", () => {
  test("uses the configured local test code", () => {
    expect(getDevelopmentOtpCode("development", "  246810  ")).toBe("246810");
  });

  test("uses a deterministic local fallback when no code is configured", () => {
    expect(getDevelopmentOtpCode("development")).toBe(
      DEFAULT_EMAIL_OTP_TEST_CODE,
    );
  });

  test("never returns a fixed code in production", () => {
    expect(getDevelopmentOtpCode("production", "246810")).toBeUndefined();
  });
});
