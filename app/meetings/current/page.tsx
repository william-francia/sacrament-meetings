import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getMeetings } from "@/lib/meetings-db";

export default async function CurrentMeetingPage() {
  await connection();

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/La_Paz",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  const sunday = new Date(Date.UTC(year, month - 1, day));
  sunday.setUTCDate(sunday.getUTCDate() - sunday.getUTCDay());

  const date = sunday.toISOString().slice(0, 10);
  const meeting = getMeetings(date)[0];
  redirect(meeting ? `/meetings/${meeting.id}` : "/meetings");
}
