
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

  return (
    <article className="rounded-lg border bg-white p-5 shadow-sm">
      <h3 className="text-xl font-semibold">{readableDate}</h3>

      <p className="mt-2 capitalize text-gray-700">
        {meeting.meetingType} Meeting
      </p>

      <p className="text-gray-600">
        Conducting: {meeting.conducting}
      </p>

      <Link
        href={`/meetings/${meeting.id}`}
        className="mt-4 inline-block font-semibold text-blue-700 underline"
      >
        View Program for {readableDate}
      </Link>
    </article>
  );
}
