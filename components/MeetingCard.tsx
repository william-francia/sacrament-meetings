
import Link from "next/link";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const date = new Date(`${meeting.date}T12:00:00Z`);
  const readableDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" }).format(date);
  const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(date);

  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-slate-200 border-l-[5px] border-l-teal-700 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
      <div className="flex min-w-24 flex-col items-center rounded-xl bg-teal-50 px-3 py-2 text-[#1c4c53]" aria-label={readableDate}>
        <span className="text-xs font-bold uppercase tracking-wider">{weekday}</span>
        <span className="text-3xl font-bold text-[#132f45]">{date.getUTCDate()}</span>
        <span className="text-xs font-semibold uppercase">{month} {date.getUTCFullYear()}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold capitalize text-[#18334a]">{meeting.meetingType} Meeting</h3>
        <p className="mt-2 text-slate-600">Conducting: <span className="font-medium text-slate-800">{meeting.conducting}</span></p>
      </div>
      <Link
        href={`/meetings/${meeting.id}`}
        className="inline-flex items-center justify-center rounded-lg bg-[#0f6269] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#0b4f55]"
      >
        View Program <span className="sr-only">for {readableDate}</span><span aria-hidden="true" className="ml-2">→</span>
      </Link>
    </article>
  );
}
