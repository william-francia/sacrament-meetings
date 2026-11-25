import { z } from "zod";
import { MEETING_TYPES } from "./types";

export const POSTGRES_INTEGER_MAX = 2_147_483_647;

export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1 || year > 9999) return false;
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function parseMeetingId(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 && id <= POSTGRES_INTEGER_MAX ? id : null;
}

const textField = (label: string, max = 255) => z.string().trim().min(1, `${label} is required.`).max(max, `${label} must be ${max} characters or fewer.`);
const hymnSchema = z.object({
  number: z.coerce.number().int().min(1, "Enter a hymn number.").max(9999, "Hymn number is too large."),
  title: textField("Hymn title", 255),
});

export const MeetingFormSchema = z.object({
  date: z.string().refine(isValidISODate, "Enter a valid meeting date."),
  meetingType: z.enum(MEETING_TYPES as ["regular", "testimony", "stake", "general"]),
  presiding: textField("Presiding name"),
  conducting: textField("Conducting name"),
  announcements: z.array(z.string().trim().min(1, "Announcement cannot be empty.").max(1000)).max(20).default([]),
  openingHymn: hymnSchema,
  openingPrayer: textField("Opening prayer"),
  wardBusiness: z.array(z.object({ description: textField("Ward business", 1000) })).max(20).default([]),
  stakeBusiness: z.boolean().default(false),
  sacramentHymn: hymnSchema,
  speakers: z.array(z.object({ name: textField("Name"), topic: z.string().trim().max(500), type: z.enum(["speaker", "musical-number"]) })).max(20).default([]),
  closingHymn: hymnSchema,
  closingPrayer: textField("Closing prayer"),
});

export function formDataToMeetingInput(formData: FormData) {
  const jsonField = (name: string): unknown => {
    const raw = formData.get(name);
    if (typeof raw !== "string") return undefined;
    try { return JSON.parse(raw); } catch { return undefined; }
  };
  return {
    date: formData.get("date"), meetingType: formData.get("meetingType"),
    presiding: formData.get("presiding"), conducting: formData.get("conducting"),
    announcements: jsonField("announcements"),
    openingHymn: { number: formData.get("openingHymnNumber"), title: formData.get("openingHymnTitle") },
    openingPrayer: formData.get("openingPrayer"), wardBusiness: jsonField("wardBusiness"),
    stakeBusiness: formData.get("stakeBusiness") === "on",
    sacramentHymn: { number: formData.get("sacramentHymnNumber"), title: formData.get("sacramentHymnTitle") },
    speakers: jsonField("speakers"),
    closingHymn: { number: formData.get("closingHymnNumber"), title: formData.get("closingHymnTitle") },
    closingPrayer: formData.get("closingPrayer"),
  };
}
