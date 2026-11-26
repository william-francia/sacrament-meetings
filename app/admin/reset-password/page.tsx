import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/RecoveryForms";

export const metadata: Metadata = { title: "Reset password", description: "Set a new account password.", robots: { index: false, follow: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  if (process.env.ENABLE_ACCOUNT_REQUESTS !== "true") notFound();
  const token = (await searchParams).token;
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) notFound();
  return <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#12334b] to-[#0f6269] px-5 py-10"><div className="w-full max-w-md rounded-3xl bg-[#fffdfa] p-8 shadow-2xl"><h1 className="text-3xl font-bold text-[#12334b]">Reset your password</h1><p className="mt-3 text-slate-600">Choose a new password for your account.</p><ResetPasswordForm token={token} /><Link href="/admin/login" className="mt-6 inline-block text-sm font-semibold text-teal-800 underline">Back to sign in</Link></div></section>;
}
