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
      <h1 className="text-3xl font-bold">Meetings</h1>
      {admin && <Link href="/meetings/new" className="no-print mt-4 inline-block rounded-lg bg-blue-800 px-4 py-2 text-white">New meeting</Link>}
      <MeetingSearch key={query} initialQuery={query} />
      {meetings.length === 0 ? (
        <p className="mt-4">No meetings are available.</p>
      ) : (
        <section className="mt-6">
          <h2 className="mb-4 text-xl font-semibold">Meeting programs</h2>
          <div className="grid gap-4">
            {meetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}
          </div>
        </section>
      )}
      <Pagination page={page} totalPages={totalPages} query={query} />
    </section>
  );
}
