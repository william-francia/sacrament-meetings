import Link from "next/link";

export default function MeetingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <nav aria-label="Meeting navigation" className="mb-6 flex gap-4">
        <Link href="/meetings" className="text-blue-700 underline">All Meetings</Link>
        <Link href="/meetings/current" className="text-blue-700 underline">Current Meeting</Link>
      </nav>
      {children}
    </div>
  );
}
