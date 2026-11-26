import { isAdminLoginConfigured } from "@/lib/auth";
import AdminLoginForm from "@/components/AdminLoginForm";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin sign in", description: "Sign in to manage sacrament meeting programs.", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return <section className="grid min-h-screen w-full overflow-hidden bg-[#fffdfa] lg:grid-cols-2">
    <div className="relative min-h-56 overflow-hidden bg-[#d9e3e6] sm:min-h-72 lg:min-h-full">
      <Image src="/buenos-aires-temple.webp" alt="Buenos Aires Argentina Temple" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center" />
      <svg aria-hidden="true" viewBox="0 0 1000 320" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-44 w-full sm:h-56 lg:h-[min(38vh,320px)]">
        <path d="M0 0H1000V160C930 240 690 290 0 300Z" fill="#12334b" />
        <path d="M0 300C690 290 930 240 1000 160" fill="none" stroke="#d4ad5c" strokeWidth="6" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="absolute left-6 top-7 flex items-center gap-4 text-white drop-shadow-md sm:left-10 sm:top-9"><span aria-hidden="true" className="text-4xl">▦</span><span className="border-l border-white/70 pl-4 text-xl font-semibold leading-tight sm:text-2xl">Sacrament Meeting<br />Planner</span></div>
    </div>
    <div className="relative flex items-center justify-center overflow-hidden px-6 py-14 sm:px-10 lg:px-14">
      <div aria-hidden="true" className="absolute -bottom-24 -right-20 h-40 w-[130%] rotate-[-9deg] rounded-[50%] bg-[#bcd9d4]/70" />
      <div className="relative z-10 w-full max-w-lg">
        <div aria-hidden="true" className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#e6f1ee] text-4xl text-[#12334b] ring-2 ring-[#d4ad5c]">▦</div>
        <h1 className="text-center text-4xl font-bold tracking-tight text-[#102d44] sm:text-5xl">Welcome back</h1>
        <p className="mt-3 text-center text-lg text-slate-600">Sign in to securely manage your ward&apos;s sacrament meetings.</p>
        {isAdminLoginConfigured() ? <AdminLoginForm /> : <p role="alert" className="mt-8 rounded-lg bg-amber-50 p-4 text-amber-950">Administrator access is not configured.</p>}
      </div>
    </div>
  </section>;
}
