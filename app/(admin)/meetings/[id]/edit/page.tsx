import { notFound } from "next/navigation";
import MeetingForm from "@/components/MeetingForm";
import { updateMeeting } from "@/lib/actions";
import { getMeetingById } from "@/lib/meetings-db";
import { parseMeetingId } from "@/lib/meeting-validation";

export default async function EditMeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseMeetingId((await params).id);
  if (!id) notFound();
  const meeting = await getMeetingById(id);
  if (!meeting) notFound();
  return <section><h1 className="text-3xl font-bold">Edit meeting</h1><MeetingForm key={id} action={updateMeeting.bind(null, id)} meeting={meeting} /></section>;
}
