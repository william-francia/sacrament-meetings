import { getMeetingById } from "@/lib/meetings-db";
import { parseMeetingId } from "@/lib/meeting-validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const meetingId = parseMeetingId(id);

  if (meetingId === null) {
    return Response.json({ error: "Invalid meeting ID" }, { status: 400 });
  }

  const meeting = await getMeetingById(meetingId);
  if (!meeting) {
    return Response.json({ error: "Meeting not found" }, { status: 404 });
  }

  return Response.json(meeting);
}
