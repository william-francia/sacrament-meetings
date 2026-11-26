"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAccount, approveAccount } from "./accounts-db";
import { hashPassword } from "./password";
import { isEnvAdminAuthenticated } from "./auth";

const requestSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  username: z.string().trim().regex(/^[a-zA-Z0-9_-]{3,32}$/),
  email: z.email().max(254).transform(value => value.toLowerCase()),
  password: z.string().min(12).max(256),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." });

export async function requestAccount(_state: string, formData: FormData): Promise<string> {
  if (process.env.ENABLE_ACCOUNT_REQUESTS !== "true") return "Account requests are not available.";
  const parsed = requestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "Check the form fields.";
  try {
    const passwordHash = await hashPassword(parsed.data.password);
    await createAccount({ fullName: parsed.data.fullName, username: parsed.data.username, email: parsed.data.email, passwordHash });
    return "Request received. An administrator must approve your account before you can sign in.";
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") return "An account with this username or email already exists.";
    return "Account requests are temporarily unavailable. Please try again later.";
  }
}

export async function approveAccountRequest(formData: FormData) {
  if (process.env.ENABLE_ACCOUNT_REQUESTS !== "true") throw new Error("Account requests are not available");
  if (!(await isEnvAdminAuthenticated())) throw new Error("Unauthorized");
  const id = formData.get("id");
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/.test(id)) throw new Error("Invalid account ID");
  await approveAccount(id);
  revalidatePath("/admin/requests");
}
