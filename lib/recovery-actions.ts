"use server";
import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { accountForReset, createPasswordResetToken, consumePasswordResetToken } from "./accounts-db";
import { hashPassword } from "./password";

const generic = "If this address has an account and email delivery is available, you will receive a reset link.";
const emailSchema = z.email().max(254);

function recoveryConfigured() {
  return process.env.ENABLE_ACCOUNT_REQUESTS === "true" && Boolean(process.env.RESEND_API_KEY && process.env.RESET_EMAIL_FROM && process.env.APP_BASE_URL);
}

export async function requestPasswordReset(_state: string, formData: FormData): Promise<string> {
  if (!recoveryConfigured()) return "Password recovery is temporarily unavailable.";
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return "Enter a valid email address.";
  try {
    const origin = new URL(process.env.APP_BASE_URL!);
    if (process.env.NODE_ENV === "production" && origin.protocol !== "https:") return "Password recovery is temporarily unavailable.";
    const account = await accountForReset(parsed.data);
    if (!account) return generic;
    const token = randomBytes(32).toString("base64url");
    const hash = createHash("sha256").update(token).digest("hex");
    if (!(await createPasswordResetToken(account.id, hash))) return generic;
    const link = new URL(`/admin/reset-password?token=${encodeURIComponent(token)}`, origin).toString();
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.RESET_EMAIL_FROM, to: [account.email], subject: "Reset your Sacrament Meeting Planner password", text: `Use this link to reset your password. It expires in 30 minutes and can be used once:\n\n${link}\n\nIf you did not request this, ignore this message.` }),
      cache: "no-store",
    });
    if (!response.ok) return generic;
    return generic;
  } catch { return generic; }
}

export async function resetPassword(_state: string, formData: FormData): Promise<string> {
  if (process.env.ENABLE_ACCOUNT_REQUESTS !== "true") return "Password recovery is temporarily unavailable.";
  const token = formData.get("token");
  const password = formData.get("password");
  const confirm = formData.get("confirmPassword");
  if (typeof token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(token)) return "This reset link is invalid or expired.";
  if (typeof password !== "string" || password.length < 12 || password.length > 256 || password !== confirm) return "Use a matching password of at least 12 characters.";
  try {
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const passwordHash = await hashPassword(password);
    return await consumePasswordResetToken(tokenHash, passwordHash) ? "Password updated. You can now sign in." : "This reset link is invalid or expired.";
  } catch { return "Password recovery is temporarily unavailable."; }
}
