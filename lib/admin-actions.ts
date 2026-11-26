"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminCookie, createAccountToken, createAdminToken, credentialsAreValid } from "./auth";
import { findAccount } from "./accounts-db";
import { verifyPassword } from "./password";

export async function signIn(_state: string, formData: FormData): Promise<string> {
  const username = formData.get("username");
  const password = formData.get("password");
  if (typeof username !== "string" || typeof password !== "string" || username.length > 128 || password.length > 256) return "Invalid credentials.";
  let token = credentialsAreValid(username, password) ? createAdminToken(username) : null;
  if (!token && process.env.ENABLE_ACCOUNT_REQUESTS === "true") {
    try {
      const account = await findAccount(username.trim());
      if (account && account.approved_at && await verifyPassword(password, account.password_hash)) token = createAccountToken(account.id);
    } catch { return "Sign in is temporarily unavailable."; }
  }
  if (!token) return "Invalid credentials.";
  (await cookies()).set(adminCookie.name, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: adminCookie.maxAge });
  redirect("/meetings/new");
}

export async function signOut() {
  (await cookies()).delete(adminCookie.name);
  redirect("/");
}
