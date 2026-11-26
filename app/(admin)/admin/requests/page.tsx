import { isEnvAdminAuthenticated } from "@/lib/auth";
import { pendingAccounts } from "@/lib/accounts-db";
import { approveAccountRequest } from "@/lib/account-actions";
import { notFound } from "next/navigation";

export const instant = false;

export default async function RequestsPage() {
  if (!(await isEnvAdminAuthenticated())) notFound();
  const accounts = await pendingAccounts();
  return <section><h1 className="text-3xl font-bold text-[#12334b]">Account requests</h1><p className="mt-2 text-slate-600">Approve only ward leaders you have verified independently.</p><div className="mt-8 space-y-4">{accounts.length === 0 ? <p>No pending requests.</p> : accounts.map(account => <div key={account.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5"><div><p className="font-semibold">{account.full_name}</p><p className="text-sm text-slate-600">{account.username} · {account.email}</p></div><form action={approveAccountRequest}><input type="hidden" name="id" value={account.id} /><button className="rounded-lg bg-[#12334b] px-4 py-2 font-semibold text-white">Approve</button></form></div>)}</div></section>;
}
