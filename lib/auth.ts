import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

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

export async function isAdminAuthenticated() {
  const key = signingKey();
  if (!key || !process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) return false;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== process.env.ADMIN_USERNAME || !/^\d+$/.test(parts[1])) return false;
  if (Number(parts[1]) <= Math.floor(Date.now() / 1000)) return false;
  const expected = signature(parts[0], parts[1]);
  if (!expected) return false;
  const actualBytes = Buffer.from(parts[2]);
  const expectedBytes = Buffer.from(expected);
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

export const adminCookie = {
  name: COOKIE_NAME,
  maxAge: MAX_AGE_SECONDS,
};
