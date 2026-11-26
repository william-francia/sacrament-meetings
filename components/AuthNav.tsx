import Link from "next/link";
import { isAdminAuthenticated, isEnvAdminAuthenticated } from "@/lib/auth";
import { signOut } from "@/lib/admin-actions";

export default async function AuthNav() {
  const authenticated = await isAdminAuthenticated();
  const envAdmin = process.env.ENABLE_ACCOUNT_REQUESTS === "true" && authenticated && await isEnvAdminAuthenticated();
  return authenticated
    ? <div className="flex items-center gap-4">{envAdmin && <Link href="/admin/requests" className="text-sm text-slate-200 hover:text-white">Account requests</Link>}<form action={signOut}><button type="submit" className="rounded-lg border border-white/40 px-3 py-2 text-sm font-medium hover:bg-white/10">Sign out</button></form></div>
    : <Link href="/admin/login" className="text-sm text-slate-200 underline-offset-4 hover:text-white hover:underline">Admin sign in</Link>;
}
