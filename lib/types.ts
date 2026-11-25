export type MeetingType =
  | "testimony"
  | "regular"
  | "stake"
  | "general";

export const MEETING_TYPES: MeetingType[] = ["regular", "testimony", "stake", "general"];

export interface Hymn {
  number: number;
  title: string;
}

export interface SpeakerItem {
  name: string;
  topic: string;
  type: "speaker" | "musical-number";
}

export interface WardBusinessItem {
  description: string;
}

export interface SacramentMeeting {
  id: number;
  date: string;
  meetingType: MeetingType;
  presiding: string;
  conducting: string;
  announcements?: string[];
  openingHymn: Hymn;
  openingPrayer: string;
  wardBusiness: WardBusinessItem[];
  stakeBusiness: boolean;
  sacramentHymn: Hymn;
  speakers: SpeakerItem[];
  closingHymn: Hymn;
  closingPrayer: string;
}

export type MeetingFormValues = Omit<SacramentMeeting, "id">;

export type MeetingFormState = {
  message: string;
  errors: Record<string, string[]>;
  values?: Record<string, unknown>;
};

export const INITIAL_MEETING_FORM_STATE: MeetingFormState = {
  message: "",
  errors: {},
};

export type MeetingMutationResult =
  | { ok: true; meeting: SacramentMeeting }
  | { ok: false; reason: "not-found" | "duplicate-date" };
