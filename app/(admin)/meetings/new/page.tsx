import MeetingForm from "@/components/MeetingForm";
import { createMeeting } from "@/lib/actions";

export default function NewMeetingPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">New meeting</h1>
      <MeetingForm action={createMeeting} />
    </section>
  );
}
