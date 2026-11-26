import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Create your account", description: "Request access to manage sacrament meeting programs.", robots: { index: false, follow: false } };

export default function RegisterPage() {
  if (process.env.ENABLE_ACCOUNT_REQUESTS !== "true") notFound();
  return <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#12334b] via-[#17465a] to-[#0f6269] px-5 py-10"><div className="w-full max-w-lg rounded-3xl bg-[#fffdfa] p-7 shadow-2xl sm:p-10"><h1 className="text-3xl font-bold text-[#12334b]">Create your account</h1><p className="mt-3 text-slate-600">Request access to help organize sacrament meeting programs. Management permissions are granted only to authorized ward leaders.</p><RegisterForm /></div></section>;
}
