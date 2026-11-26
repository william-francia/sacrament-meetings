import type { Metadata } from "next";
import Link from "next/link";
import { RequestResetForm } from "@/components/RecoveryForms";

export const metadata: Metadata = { title: "Password recovery", description: "Information about account password recovery.", robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  const configured = process.env.ENABLE_ACCOUNT_REQUESTS === "true" && Boolean(process.env.RESEND_API_KEY && process.env.RESET_EMAIL_FROM && process.env.APP_BASE_URL);
  return <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#12334b] to-[#0f6269] px-5 py-10"><div className="w-full max-w-md rounded-3xl bg-[#fffdfa] p-8 shadow-2xl"><h1 className="text-3xl font-bold text-[#12334b]">Password recovery</h1><p className="mt-4 text-slate-600">Enter your registered email address to request a password reset link.</p>{configured ? <RequestResetForm /> : <p role="status" className="mt-8 rounded-lg bg-amber-50 p-4 text-amber-950">Online password recovery is temporarily unavailable. Please contact the ward administrator.</p>}<Link href="/admin/login" className="mt-8 inline-block font-semibold text-teal-800 underline">Back to sign in</Link></div></section>;
}
