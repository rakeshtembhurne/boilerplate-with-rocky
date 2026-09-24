export const DEFAULT_EMAIL_OTP_TEST_CODE = "123456";

export function getDevelopmentOtpCode(
  nodeEnv: string,
  configuredCode?: string,
): string | undefined {
  if (nodeEnv === "production") return undefined;

  return configuredCode?.trim() || DEFAULT_EMAIL_OTP_TEST_CODE;
}
