import MeetingCard from "@/components/MeetingCard";
import { getMeetings } from "@/lib/meetings-db";

export default async function MeetingsPage() {
  const meetings = await getMeetings();

  return (
    <section>
      <h1 className="text-3xl font-bold">Meetings</h1>
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
    </section>
  );
}
