import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { accountIsApproved } from "./accounts-db";

const COOKIE_NAME = "sacrament_meetings_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function signingKey() {
  const key = process.env.ADMIN_SESSION_SECRET;
  if (!key || key.length < 32) return null;
  return key;
}

export function isAdminLoginConfigured() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && signingKey());
}

export function credentialsAreValid(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword || !signingKey()) return false;
  const safeEqual = (a: string, b: string) => {
    const left = Buffer.from(a);
    const right = Buffer.from(b);
    return left.length === right.length && timingSafeEqual(left, right);
  };
  return safeEqual(username, expectedUser) && safeEqual(password, expectedPassword);
}

function signature(username: string, expires: string) {
  const key = signingKey();
  if (!key) return null;
  return createHmac("sha256", key).update(`${username}.${expires}`).digest("base64url");
}

export function createAdminToken(username: string) {
  const expires = String(Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS);
  const signed = signature(username, expires);
  if (!signed) return null;
  return `${username}.${expires}.${signed}`;
}

export function createAccountToken(id: string) {
  return createAdminToken(`user:${id}`);
}

async function verifiedSubject() {
  if (!signingKey()) return null;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3 || !/^\d+$/.test(parts[1])) return null;
  if (Number(parts[1]) <= Math.floor(Date.now() / 1000)) return null;
  const expected = signature(parts[0], parts[1]);
  if (!expected) return null;
  const actualBytes = Buffer.from(parts[2]);
  const expectedBytes = Buffer.from(expected);
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes) ? parts[0] : null;
}

export async function isEnvAdminAuthenticated() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && (await verifiedSubject()) === process.env.ADMIN_USERNAME);
}

export async function isAdminAuthenticated() {
  const subject = await verifiedSubject();
  if (!subject) return false;
  if (subject === process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) return true;
  if (process.env.ENABLE_ACCOUNT_REQUESTS !== "true") return false;
  const match = /^user:([0-9a-f-]{36})$/.exec(subject);
  if (!match) return false;
  try { return await accountIsApproved(match[1]); } catch { return false; }
}

export const adminCookie = {
  name: COOKIE_NAME,
  maxAge: MAX_AGE_SECONDS,
};
