"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminCookie, createAdminToken, credentialsAreValid } from "./auth";

export async function signIn(_state: string, formData: FormData): Promise<string> {
  const username = formData.get("username");
  const password = formData.get("password");
  if (typeof username !== "string" || typeof password !== "string" || !credentialsAreValid(username, password)) return "Invalid credentials.";
  const token = createAdminToken(username);
  if (!token) return "Administrator access is not configured.";
  (await cookies()).set(adminCookie.name, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: adminCookie.maxAge });
  redirect("/meetings/new");
}
