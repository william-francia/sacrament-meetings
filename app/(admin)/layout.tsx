import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export const instant = false;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  return <div className="flex min-h-screen flex-col"><Header /><main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">{children}</main><Footer /></div>;
}
