"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createMeeting as insertMeeting, updateMeeting as saveMeeting, deleteMeeting as removeMeeting } from "./meetings-db";
import { MeetingFormSchema, formDataToMeetingInput, parseMeetingId } from "./meeting-validation";
import { isAdminAuthenticated } from "./auth";
import type { MeetingFormState } from "./types";

const forbidden: MeetingFormState = { message: "You are not authorized to manage meetings.", errors: {} };
const unexpected: MeetingFormState = { message: "We could not save your changes. Please try again.", errors: {} };

function submittedValues(formData: FormData) {
  return Object.fromEntries([...formData.entries()].filter(([, value]) => typeof value === "string"));
}

async function writeMeeting(formData: FormData, operation: "create" | "update", id?: number) {
  const parsed = MeetingFormSchema.safeParse(formDataToMeetingInput(formData));
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const root = String(issue.path[0] ?? "form");
      const key = ["openingHymn", "sacramentHymn", "closingHymn"].includes(root) && issue.path[1]
        ? `${root}${String(issue.path[1]).at(0)?.toUpperCase()}${String(issue.path[1]).slice(1)}`
        : root;
      (errors[key] ??= []).push(issue.message);
    }
    return { message: "Please correct the highlighted fields.", errors, values: submittedValues(formData) };
  }
  try {
    const result = operation === "create" ? await insertMeeting(parsed.data) : await saveMeeting(id!, parsed.data);
    if (!result.ok) return { message: result.reason === "duplicate-date" ? "A meeting already exists for that date." : "This meeting no longer exists.", errors: result.reason === "duplicate-date" ? { date: ["Choose a date without an existing meeting."] } : {}, values: submittedValues(formData) };
  } catch (error) {
    console.error("Meeting save failed", error instanceof Error ? error.name : "Unknown error");
    return unexpected;
  }
  revalidatePath("/meetings");
  revalidatePath("/");
  redirect("/meetings");
}

export async function createMeeting(_previousState: MeetingFormState, formData: FormData): Promise<MeetingFormState> {
  if (!(await isAdminAuthenticated())) return forbidden;
  return writeMeeting(formData, "create");
}

export async function updateMeeting(id: number, _previousState: MeetingFormState, formData: FormData): Promise<MeetingFormState> {
  if (!(await isAdminAuthenticated())) return forbidden;
  if (!Number.isInteger(id) || id < 1 || id > 2_147_483_647) return { message: "Invalid meeting ID.", errors: {} };
  return writeMeeting(formData, "update", id);
}

export async function deleteMeeting(_previousState: MeetingFormState, formData: FormData): Promise<MeetingFormState> {
  if (!(await isAdminAuthenticated())) return forbidden;
  const rawId = formData.get("id");
  const id = typeof rawId === "string" ? parseMeetingId(rawId) : null;
  if (!id) return { message: "Invalid meeting ID.", errors: {} };
  try {
    if (!(await removeMeeting(id))) return { message: "This meeting no longer exists.", errors: {} };
  } catch (error) {
    console.error("Meeting delete failed", error instanceof Error ? error.name : "Unknown error");
    return unexpected;
  }
  revalidatePath("/meetings");
  revalidatePath("/");
  redirect("/meetings");
}
