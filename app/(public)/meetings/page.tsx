import MeetingCard from "@/components/MeetingCard";
import MeetingSearch from "@/components/MeetingSearch";
import Link from "next/link";
import { getMeetings, getMeetingsTotalPages } from "@/lib/meetings-db";

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
  const pageHref = (target: number) => {
    const url = new URLSearchParams();
    if (query) url.set("query", query);
    url.set("page", String(target));
    return `/meetings?${url}`;
  };

  return (
    <section>
      <h1 className="text-3xl font-bold">Meetings</h1>
      <MeetingSearch initialQuery={query} />
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
      {totalPages > 1 && (
        <nav aria-label="Meeting pages" className="mt-6 flex items-center gap-4">
          {page > 1 && <Link href={pageHref(page - 1)} className="text-blue-700 underline">Previous</Link>}
          <span>Page {page} of {totalPages}</span>
          {page < totalPages && <Link href={pageHref(page + 1)} className="text-blue-700 underline">Next</Link>}
        </nav>
      )}
    </section>
  );
}
