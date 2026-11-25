import { isAdminLoginConfigured } from "@/lib/auth";
import AdminLoginForm from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return <main className="mx-auto max-w-md px-6 py-16">
    <h1 className="text-3xl font-bold text-slate-900">Administrator sign in</h1>
    {isAdminLoginConfigured() ? <AdminLoginForm /> : <p className="mt-6 rounded-lg bg-amber-50 p-4 text-amber-950">Administrator access is not configured.</p>}
  </main>;
}
