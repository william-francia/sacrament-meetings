import { neon } from "@neondatabase/serverless";
import type { Hymn, MeetingType, SacramentMeeting, SpeakerItem, WardBusinessItem } from "./types";

const PAGE_SIZE = 5;

type MeetingRow = {
  id: number;
  date: Date | string;
  meeting_type: MeetingType;
  presiding: string;
  conducting: string;
  announcements: string[] | null;
  opening_hymn: Hymn;
  opening_prayer: string;
  ward_business: WardBusinessItem[];
  stake_business: boolean;
  sacrament_hymn: Hymn;
  speakers: SpeakerItem[];
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
    meetingType: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: row.announcements ?? undefined,
    openingHymn: row.opening_hymn,
    openingPrayer: row.opening_prayer,
    wardBusiness: row.ward_business,
    stakeBusiness: row.stake_business,
    sacramentHymn: row.sacrament_hymn,
    speakers: row.speakers,
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

// W04 mutation stubs.
export async function createMeeting(_meeting: Omit<SacramentMeeting, "id">): Promise<never> {
  void _meeting;
  throw new Error("Creating meetings is planned for W04");
}

export async function updateMeeting(_id: number, _meeting: Partial<SacramentMeeting>): Promise<never> {
  void _id;
  void _meeting;
  throw new Error("Updating meetings is planned for W04");
}

export async function deleteMeeting(_id: number): Promise<never> {
  void _id;
  throw new Error("Deleting meetings is planned for W04");
}
