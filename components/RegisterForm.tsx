"use client";
import { useActionState } from "react";
import Link from "next/link";
import { requestAccount } from "@/lib/account-actions";

export default function RegisterForm() {
  const [message, action, pending] = useActionState(requestAccount, "");
  return <form action={action} className="mt-8 space-y-4">
    {message && <p role="status" aria-live="polite" className="rounded-lg bg-teal-50 p-3 text-sm text-[#12334b]">{message}</p>}
    {[["fullName", "Full name", "name"], ["username", "Username", "username"], ["email", "Email address", "email"]].map(([name, label, autoComplete]) => <div key={name}><label htmlFor={name} className="mb-1 block font-medium">{label}</label><input id={name} name={name} type={name === "email" ? "email" : "text"} autoComplete={autoComplete} required maxLength={name === "email" ? 254 : 100} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3" /></div>)}
    <div><label htmlFor="registerPassword" className="mb-1 block font-medium">Password</label><input id="registerPassword" name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={256} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3" /><p className="mt-1 text-sm text-slate-600">Use at least 12 characters.</p></div>
    <div><label htmlFor="confirmPassword" className="mb-1 block font-medium">Confirm password</label><input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3" /></div>
    <button disabled={pending} className="w-full rounded-xl bg-[#12334b] px-5 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Submitting…" : "Request account"}</button>
    <p className="text-center text-sm text-slate-600">Already have an account? <Link href="/admin/login" className="font-semibold text-teal-800 underline">Sign in</Link></p>
  </form>;
}
