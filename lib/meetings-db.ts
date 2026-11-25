import { neon } from "@neondatabase/serverless";
import type { Hymn, MeetingFormValues, MeetingMutationResult, MeetingType, SacramentMeeting, SpeakerItem, WardBusinessItem } from "./types";

const PAGE_SIZE = 5;

type MeetingRow = {
  id: number;
  date: Date | string;
  meeting_type: MeetingType | "special";
  presiding: string;
  conducting: string;
  announcements: string[] | null;
  opening_hymn: Hymn;
  opening_prayer: string;
  ward_business: WardBusinessItem[] | null;
  stake_business: boolean | null;
  sacrament_hymn: Hymn;
  speakers: SpeakerItem[] | null;
  closing_hymn: Hymn;
  closing_prayer: string;
};

function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return neon(process.env.DATABASE_URL);
}

function toMeeting(row: MeetingRow): SacramentMeeting {
  return {
    id: row.id,
    date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : row.date,
    meetingType: row.meeting_type === "special" ? "general" : row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: row.announcements ?? undefined,
    openingHymn: row.opening_hymn,
    openingPrayer: row.opening_prayer,
    wardBusiness: row.ward_business ?? [],
    stakeBusiness: row.stake_business ?? false,
    sacramentHymn: row.sacrament_hymn,
    speakers: row.speakers ?? [],
    closingHymn: row.closing_hymn,
    closingPrayer: row.closing_prayer,
  };
}

export async function getMeetings(query = "", page = 1): Promise<SacramentMeeting[]> {
  const sql = database();
  const pattern = `%${query.trim()}%`;
  const offset = (Math.max(1, page) - 1) * PAGE_SIZE;
  const rows = await sql`
    SELECT * FROM meetings
    WHERE presiding ILIKE ${pattern}
       OR conducting ILIKE ${pattern}
       OR meeting_type ILIKE ${pattern}
       OR EXISTS (
         SELECT 1 FROM jsonb_array_elements(speakers) AS speaker
         WHERE speaker->>'name' ILIKE ${pattern}
       )
    ORDER BY date DESC, id DESC
    LIMIT ${PAGE_SIZE} OFFSET ${offset}
  `;
  return (rows as MeetingRow[]).map(toMeeting);
}

export async function getMeetingsTotalPages(query = ""): Promise<number> {
  const sql = database();
  const pattern = `%${query.trim()}%`;
  const rows = await sql`
    SELECT count(*)::int AS total FROM meetings
    WHERE presiding ILIKE ${pattern}
       OR conducting ILIKE ${pattern}
       OR meeting_type ILIKE ${pattern}
       OR EXISTS (
         SELECT 1 FROM jsonb_array_elements(speakers) AS speaker
         WHERE speaker->>'name' ILIKE ${pattern}
       )
  `;
  return Math.ceil((rows[0].total as number) / PAGE_SIZE);
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
  const sql = database();
  const rows = await sql`SELECT * FROM meetings WHERE id = ${id} LIMIT 1`;
  return rows.length ? toMeeting(rows[0] as MeetingRow) : null;
}

export async function getMeetingsByDate(date: string): Promise<SacramentMeeting[]> {
  const sql = database();
  const rows = await sql`SELECT * FROM meetings WHERE date = ${date} ORDER BY id DESC`;
  return (rows as MeetingRow[]).map(toMeeting);
}

export async function createMeeting(meeting: MeetingFormValues): Promise<MeetingMutationResult> {
  const sql = database();
  try {
    const rows = await sql`
      INSERT INTO meetings (
        date, meeting_type, presiding, conducting, announcements,
        opening_hymn, opening_prayer, ward_business, stake_business,
        sacrament_hymn, speakers, closing_hymn, closing_prayer
      ) VALUES (
        ${meeting.date}::date, ${meeting.meetingType}, ${meeting.presiding}, ${meeting.conducting}, ${meeting.announcements}::text[],
        ${JSON.stringify(meeting.openingHymn)}::jsonb, ${meeting.openingPrayer}, ${JSON.stringify(meeting.wardBusiness)}::jsonb, ${meeting.stakeBusiness},
        ${JSON.stringify(meeting.sacramentHymn)}::jsonb, ${JSON.stringify(meeting.speakers)}::jsonb, ${JSON.stringify(meeting.closingHymn)}::jsonb, ${meeting.closingPrayer}
      ) RETURNING *
    `;
    return { ok: true, meeting: toMeeting(rows[0] as MeetingRow) };
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false, reason: "duplicate-date" };
    throw error;
  }
}

export async function updateMeeting(id: number, meeting: MeetingFormValues): Promise<MeetingMutationResult> {
  const sql = database();
  try {
    const rows = await sql`
      UPDATE meetings SET date=${meeting.date}::date, meeting_type=${meeting.meetingType}, presiding=${meeting.presiding}, conducting=${meeting.conducting}, announcements=${meeting.announcements}::text[],
        opening_hymn=${JSON.stringify(meeting.openingHymn)}::jsonb, opening_prayer=${meeting.openingPrayer}, ward_business=${JSON.stringify(meeting.wardBusiness)}::jsonb, stake_business=${meeting.stakeBusiness},
        sacrament_hymn=${JSON.stringify(meeting.sacramentHymn)}::jsonb, speakers=${JSON.stringify(meeting.speakers)}::jsonb, closing_hymn=${JSON.stringify(meeting.closingHymn)}::jsonb, closing_prayer=${meeting.closingPrayer}
      WHERE id=${id} RETURNING *
    `;
    return rows.length ? { ok: true, meeting: toMeeting(rows[0] as MeetingRow) } : { ok: false, reason: "not-found" };
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false, reason: "duplicate-date" };
    throw error;
  }
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}

export async function deleteMeeting(id: number): Promise<boolean> {
  const sql = database();
  const rows = await sql`DELETE FROM meetings WHERE id=${id} RETURNING id`;
  return rows.length > 0;
}
