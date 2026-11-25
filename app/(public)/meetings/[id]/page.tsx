import { notFound } from "next/navigation";
import MeetingDetail from "@/components/MeetingDetail";
import { getMeetingById } from "@/lib/meetings-db";
import { parseMeetingId } from "@/lib/meeting-validation";
import { isAdminAuthenticated } from "@/lib/auth";
import DeleteMeeting from "@/components/DeleteMeeting";
import Link from "next/link";

export default async function MeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meetingId = parseMeetingId(id);

  if (meetingId === null) notFound();

  const meeting = await getMeetingById(meetingId);
  if (!meeting) notFound();

  const admin = await isAdminAuthenticated();
  return <><MeetingDetail meeting={meeting} />{admin && <div className="no-print mt-6"><Link href={`/meetings/${meeting.id}/edit`} className="rounded-lg bg-blue-800 px-4 py-2 text-white">Edit meeting</Link><DeleteMeeting id={meeting.id} /></div>}</>;
}
