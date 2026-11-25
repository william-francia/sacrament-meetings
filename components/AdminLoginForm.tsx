"use client";
import { useActionState } from "react";
import { signIn } from "@/lib/admin-actions";

export default function AdminLoginForm() {
  const [message, action, pending] = useActionState(signIn, "");
  return <form action={action} className="mt-8 space-y-5 rounded-2xl bg-white p-6 shadow-sm">
    <p role="status" aria-live="polite" className="text-red-700">{message}</p>
    <div><label htmlFor="username" className="block font-medium">Username</label><input id="username" name="username" autoComplete="username" required className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></div>
    <div><label htmlFor="password" className="block font-medium">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></div>
    <button disabled={pending} className="rounded-lg bg-blue-800 px-5 py-3 font-semibold text-white disabled:opacity-50">{pending ? "Signing in…" : "Sign in"}</button>
  </form>;
}
