import MeetingCard from "@/components/MeetingCard";
import MeetingSearch from "@/components/MeetingSearch";
import Pagination from "@/components/Pagination";
import { getMeetings, getMeetingsTotalPages } from "@/lib/meetings-db";
import { isAdminAuthenticated } from "@/lib/auth";
import Link from "next/link";

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string | string[]; page?: string | string[] }>;
}) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query.trim() : "";
  const requestedPage = typeof params.page === "string" ? Number(params.page) : 1;
  const totalPages = await getMeetingsTotalPages(query);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, Math.max(1, totalPages))
    : 1;
  const meetings = await getMeetings(query, page);
  const admin = await isAdminAuthenticated();

  return (
    <section>
      <div className="rounded-2xl bg-gradient-to-r from-slate-100 to-teal-50 px-6 py-9 sm:px-10">
        <p className="text-sm font-bold tracking-[0.2em] text-teal-700">MEETINGS</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#122d43] sm:text-5xl">Meetings</h1>
        <p className="mt-3 max-w-xl text-slate-600">Plan, organize, and review sacrament meeting programs.</p>
      </div>
      <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <MeetingSearch key={query} initialQuery={query} />
      </div>
      {admin && <Link href="/meetings/new" className="no-print mt-5 inline-block rounded-lg bg-[#0f6269] px-4 py-2 font-semibold text-white">New meeting</Link>}
      {meetings.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">No meetings match this search.</p>
      ) : (
        <section className="mt-6">
          <h2 className="mb-4 text-2xl font-bold text-[#122d43]">Meeting programs</h2>
          <div className="grid gap-4">
            {meetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}
          </div>
        </section>
      )}
      <Pagination page={page} totalPages={totalPages} query={query} />
    </section>
  );
}
