"use client";
import { useActionState } from "react";
import { requestPasswordReset, resetPassword } from "@/lib/recovery-actions";

const field = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700";

export function RequestResetForm() {
  const [message, action, pending] = useActionState(requestPasswordReset, "");
  return <form action={action} className="mt-8 space-y-5">
    {message && <p role="status" aria-live="polite" className="rounded-lg bg-teal-50 p-3 text-sm text-[#12334b]">{message}</p>}
    <div><label htmlFor="recoveryEmail" className="mb-2 block font-medium">Email address</label><input id="recoveryEmail" name="email" type="email" autoComplete="email" required maxLength={254} className={field} /></div>
    <button disabled={pending} className="w-full rounded-xl bg-[#12334b] px-5 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Sending…" : "Send reset link"}</button>
  </form>;
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [message, action, pending] = useActionState(resetPassword, "");
  return <form action={action} className="mt-8 space-y-5">
    {message && <p role="status" aria-live="polite" className="rounded-lg bg-teal-50 p-3 text-sm text-[#12334b]">{message}</p>}
    <input type="hidden" name="token" value={token} />
    <div><label htmlFor="newPassword" className="mb-2 block font-medium">New password</label><input id="newPassword" name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={256} className={field} /></div>
    <div><label htmlFor="confirmNewPassword" className="mb-2 block font-medium">Confirm new password</label><input id="confirmNewPassword" name="confirmPassword" type="password" autoComplete="new-password" required minLength={12} maxLength={256} className={field} /></div>
    <button disabled={pending} className="w-full rounded-xl bg-[#12334b] px-5 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Updating…" : "Update password"}</button>
  </form>;
}
