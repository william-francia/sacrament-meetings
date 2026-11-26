"use client";
import { useActionState, useState } from "react";
import { signIn } from "@/lib/admin-actions";

export default function AdminLoginForm() {
  const [message, action, pending] = useActionState(signIn, "");
  const [showPassword, setShowPassword] = useState(false);
  return <form action={action} className="mt-10 space-y-5">
    {message && <p role="alert" aria-live="polite" className="rounded-lg bg-red-50 p-3 text-red-800">{message}</p>}
    <div><label htmlFor="username" className="mb-2 block font-medium text-[#102d44]">Username</label><input id="username" name="username" autoComplete="username" required maxLength={128} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700" /></div>
    <div><label htmlFor="password" className="mb-2 block font-medium text-[#102d44]">Password</label><div className="relative"><input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required maxLength={256} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-20 text-slate-900 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute inset-y-1 right-2 rounded-lg px-3 text-sm font-medium text-[#12334b] hover:bg-slate-100">{showPassword ? "Hide" : "Show"}</button></div></div>
    <button disabled={pending} className="w-full rounded-xl bg-[#12334b] px-5 py-3.5 text-lg font-semibold text-white shadow-md transition-colors hover:bg-[#1e4d65] disabled:cursor-wait disabled:opacity-60">{pending ? "Signing in…" : "Sign in"}</button>
  </form>;
}
