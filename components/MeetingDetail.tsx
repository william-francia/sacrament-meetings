
import type { SacramentMeeting } from "@/lib/types";
import PrintButton from "./PrintButton";

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const isSacramentMeeting =
    meeting.meetingType === "regular" ||
    meeting.meetingType === "testimony";

  return (
    <article className="rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold">Sunday Meeting Program</h1>

      <p className="mt-2">Date: {meeting.date}</p>
      <p className="capitalize">Type: {meeting.meetingType}</p>
      <p>Presiding: {meeting.presiding}</p>
      <p>Conducting: {meeting.conducting}</p>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">Announcements</h2>
        <ul className="list-disc pl-6">
          {(meeting.announcements ?? []).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6 space-y-2">
        <h2 className="text-xl font-semibold">Meeting Agenda</h2>
        <p>Opening Hymn: {meeting.openingHymn.number} - {meeting.openingHymn.title}</p>
        <p>Opening Prayer: {meeting.openingPrayer}</p>

        <h3 className="font-semibold">Ward Business</h3>
        {meeting.wardBusiness.length > 0 ? (
          <ul className="list-disc pl-6">
            {meeting.wardBusiness.map((item, index) => (
              <li key={index}>{item.description}</li>
            ))}
          </ul>
        ) : (
          <p>None</p>
        )}

        <p>Stake Business: {meeting.stakeBusiness ? "Yes" : "No"}</p>

        {isSacramentMeeting ? (
          <p>
            Sacrament Hymn: {meeting.sacramentHymn.number} -{" "}
            {meeting.sacramentHymn.title}
          </p>
        ) : (
          <p>No sacrament ordinance in this meeting.</p>
        )}

        <h3 className="font-semibold">Speakers and Musical Numbers</h3>
        <ul className="list-disc pl-6">
          {meeting.speakers.map((item, index) => (
            <li key={index}>
              {item.type === "musical-number" ? "Music" : "Speaker"}:{" "}
              {item.name}
              {item.topic ? ` - ${item.topic}` : ""}
            </li>
          ))}
        </ul>

        <p>Closing Hymn: {meeting.closingHymn.number} - {meeting.closingHymn.title}</p>
        <p>Closing Prayer: {meeting.closingPrayer}</p>
      </section>

      <div className="mt-8">
        <PrintButton />
      </div>
    </article>
  );
}
