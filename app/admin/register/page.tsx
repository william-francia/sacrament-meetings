import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";

export const metadata: Metadata = { title: "Create your account", description: "Request access to manage sacrament meeting programs.", robots: { index: false, follow: false } };

export default function RegisterPage() {
  return <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#12334b] via-[#17465a] to-[#0f6269] px-5 py-10"><div className="w-full max-w-lg rounded-3xl bg-[#fffdfa] p-7 shadow-2xl sm:p-10"><h1 className="text-3xl font-bold text-[#12334b]">Create your account</h1><p className="mt-3 text-slate-600">Request access to help organize sacrament meeting programs. Management permissions are granted only to authorized ward leaders.</p>{process.env.ENABLE_ACCOUNT_REQUESTS === "true" ? <RegisterForm /> : <p role="status" className="mt-8 rounded-lg bg-amber-50 p-4 text-amber-950">Account requests are temporarily unavailable while setup is completed.</p>}<Link href="/admin/login" className="mt-6 inline-block text-sm font-semibold text-teal-800 underline">Back to sign in</Link></div></section>;
}
