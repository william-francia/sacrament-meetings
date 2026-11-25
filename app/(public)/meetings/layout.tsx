import Link from "next/link";

export default function MeetingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-9 sm:py-12">
      <nav aria-label="Meeting navigation" className="mb-8 flex flex-wrap gap-5 text-sm">
        <Link href="/meetings" className="text-blue-700 underline">All Meetings</Link>
        <Link href="/meetings/current" className="text-blue-700 underline">Current Meeting</Link>
      </nav>
      {children}
    </div>
  );
}
