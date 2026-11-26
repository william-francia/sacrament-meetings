import "server-only";
import { neon } from "@neondatabase/serverless";

function db() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return neon(process.env.DATABASE_URL);
}

export async function findAccount(identifier: string) {
  const rows = await db()`SELECT id, password_hash, approved_at FROM account_requests WHERE lower(username) = ${identifier.toLowerCase()} OR lower(email) = ${identifier.toLowerCase()} LIMIT 1`;
  return rows[0] as { id: string; password_hash: string; approved_at: string | null } | undefined;
}

export async function accountIsApproved(id: string) {
  const rows = await db()`SELECT id FROM account_requests WHERE id = ${id}::uuid AND approved_at IS NOT NULL LIMIT 1`;
  return rows.length > 0;
}

export async function createAccount(input: { fullName: string; username: string; email: string; passwordHash: string }) {
  await db()`INSERT INTO account_requests (full_name, username, email, password_hash) VALUES (${input.fullName}, ${input.username}, ${input.email}, ${input.passwordHash})`;
}

export async function pendingAccounts() {
  return await db()`SELECT id, full_name, username, email, created_at FROM account_requests WHERE approved_at IS NULL ORDER BY created_at ASC` as { id: string; full_name: string; username: string; email: string; created_at: string }[];
}

export async function approveAccount(id: string) {
  await db()`UPDATE account_requests SET approved_at = now() WHERE id = ${id}::uuid AND approved_at IS NULL`;
}
