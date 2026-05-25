export const ACCESS_COOKIE_NAME = "access_granted";
export const ACCESS_COOKIE_VALUE = "true";
export const ACCESS_COOKIE_PATH = "/haunted-house";
export const ACCESS_COOKIE_MAX_AGE_SECONDS = 60 * 60;

const isProduction: boolean = process.env.NODE_ENV === "production";

export const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax" as const,
  secure: isProduction,
};
