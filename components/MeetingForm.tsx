"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { MeetingFormState, MeetingFormValues } from "@/lib/types";
import { INITIAL_MEETING_FORM_STATE, MEETING_TYPES } from "@/lib/types";

type Action = (state: MeetingFormState, formData: FormData) => Promise<MeetingFormState>;

export default function MeetingForm({ action, meeting }: { action: Action; meeting?: MeetingFormValues }) {
  const [state, formAction, pending] = useActionState(action, INITIAL_MEETING_FORM_STATE);
  const [announcements, setAnnouncements] = useState(meeting?.announcements ?? []);
  const [wardBusiness, setWardBusiness] = useState(meeting?.wardBusiness.map(item => item.description) ?? []);
  const [speakers, setSpeakers] = useState(meeting?.speakers ?? []);
  const values = state.values ?? {};
  const value = (name: string, fallback = "") => String(values[name] ?? fallback);
  const error = (name: string) => state.errors[name]?.[0];
  const field = (name: string, label: string, fallback = "", type = "text") => <div>
    <label htmlFor={name} className="block font-medium text-slate-800">{label}</label>
    <input id={name} name={name} type={type} defaultValue={value(name, fallback)} aria-invalid={!!error(name)} aria-describedby={error(name) ? `${name}-error` : undefined} required className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 focus-visible:outline-2 focus-visible:outline-blue-700" />
    <p id={`${name}-error`} aria-live="polite" className="mt-1 text-sm text-red-700">{error(name)}</p>
  </div>;
  const hymn = (prefix: "openingHymn" | "sacramentHymn" | "closingHymn", label: string) => <fieldset className="grid gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-[8rem_1fr]">
    <legend className="px-2 font-semibold">{label}</legend>
    {field(`${prefix}Number`, "Number", String(meeting?.[prefix].number ?? ""), "number")}
    {field(`${prefix}Title`, "Title", meeting?.[prefix].title ?? "")}
    <p aria-live="polite" className="text-sm text-red-700 sm:col-span-2">{error(prefix)}</p>
  </fieldset>;
  return <form action={formAction} className="mt-8 space-y-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
    <p aria-live="polite" role={state.message ? "status" : undefined} className="text-red-700">{state.message}</p>
    <div className="grid gap-5 sm:grid-cols-2">
      {field("date", "Meeting date", meeting?.date ?? "", "date")}
      <div><label htmlFor="meetingType" className="block font-medium">Meeting type</label><select id="meetingType" name="meetingType" defaultValue={value("meetingType", meeting?.meetingType ?? "regular")} className="mt-1 w-full rounded-lg border border-slate-300 p-3">{MEETING_TYPES.map(type => <option key={type} value={type}>{type}</option>)}</select><p aria-live="polite" className="text-sm text-red-700">{error("meetingType")}</p></div>
      {field("presiding", "Presiding", meeting?.presiding)}{field("conducting", "Conducting", meeting?.conducting)}
    </div>
    {hymn("openingHymn", "Opening hymn")}{field("openingPrayer", "Opening prayer", meeting?.openingPrayer)}
    {hymn("sacramentHymn", "Sacrament hymn")}
    <fieldset className="space-y-3 rounded-xl border border-slate-200 p-4"><legend className="px-2 font-semibold">Ward business</legend>
      {wardBusiness.map((item, index) => <div key={index} className="flex gap-2"><label className="sr-only" htmlFor={`ward-${index}`}>Ward business {index + 1}</label><input id={`ward-${index}`} value={item} onChange={e => setWardBusiness(items => items.map((v,i) => i === index ? e.target.value : v))} className="w-full rounded-lg border p-2" /><button type="button" onClick={() => setWardBusiness(items => items.filter((_,i) => i !== index))} aria-label={`Remove ward business ${index + 1}`} className="rounded-lg border px-3">Remove</button></div>)}
      <button type="button" onClick={() => setWardBusiness(items => [...items, ""])} className="text-blue-800 underline">Add ward business</button><input type="hidden" name="wardBusiness" value={JSON.stringify(wardBusiness.map(description => ({description})))} /><p aria-live="polite" className="text-sm text-red-700">{error("wardBusiness")}</p>
    </fieldset>
    <label className="flex items-center gap-3"><input type="checkbox" name="stakeBusiness" defaultChecked={meeting?.stakeBusiness} /> Stake business</label>
    <fieldset className="space-y-3 rounded-xl border border-slate-200 p-4"><legend className="px-2 font-semibold">Speakers and musical numbers</legend>
      {speakers.map((item,index) => <div key={index} className="grid gap-2 rounded-lg bg-slate-50 p-3 sm:grid-cols-4"><label className="sr-only" htmlFor={`speaker-type-${index}`}>Item type {index + 1}</label><select id={`speaker-type-${index}`} value={item.type} onChange={e => setSpeakers(items => items.map((v,i) => i === index ? {...v,type:e.target.value as typeof v.type} : v))} className="rounded border p-2"><option value="speaker">Speaker</option><option value="musical-number">Music</option></select><label className="sr-only" htmlFor={`speaker-name-${index}`}>Name {index + 1}</label><input id={`speaker-name-${index}`} placeholder="Name" value={item.name} onChange={e => setSpeakers(items => items.map((v,i) => i === index ? {...v,name:e.target.value} : v))} className="rounded border p-2" /><label className="sr-only" htmlFor={`speaker-topic-${index}`}>Topic {index + 1}</label><input id={`speaker-topic-${index}`} placeholder="Topic" value={item.topic} onChange={e => setSpeakers(items => items.map((v,i) => i === index ? {...v,topic:e.target.value} : v))} className="rounded border p-2" /><button type="button" onClick={() => setSpeakers(items => items.filter((_,i) => i !== index))} className="rounded border p-2">Remove</button></div>)}
      <button type="button" onClick={() => setSpeakers(items => [...items, {name:"",topic:"",type:"speaker"}])} className="text-blue-800 underline">Add speaker or music</button><input type="hidden" name="speakers" value={JSON.stringify(speakers)} /><p aria-live="polite" className="text-sm text-red-700">{error("speakers")}</p>
    </fieldset>
    <fieldset className="space-y-3 rounded-xl border border-slate-200 p-4"><legend className="px-2 font-semibold">Announcements</legend>{announcements.map((item,index) => <div key={index} className="flex gap-2"><label className="sr-only" htmlFor={`announcement-${index}`}>Announcement {index + 1}</label><input id={`announcement-${index}`} value={item} onChange={e => setAnnouncements(items => items.map((v,i) => i === index ? e.target.value : v))} className="w-full rounded border p-2" /><button type="button" onClick={() => setAnnouncements(items => items.filter((_,i) => i !== index))} className="rounded border px-3">Remove</button></div>)}<button type="button" onClick={() => setAnnouncements(items => [...items, ""])} className="text-blue-800 underline">Add announcement</button><input type="hidden" name="announcements" value={JSON.stringify(announcements)} /><p aria-live="polite" className="text-sm text-red-700">{error("announcements")}</p></fieldset>
    {hymn("closingHymn", "Closing hymn")}{field("closingPrayer", "Closing prayer", meeting?.closingPrayer)}
    <div className="flex flex-wrap items-center gap-4"><button type="submit" disabled={pending} className="rounded-lg bg-blue-800 px-6 py-3 font-semibold text-white disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2">{pending ? "Saving…" : meeting ? "Save changes" : "Create meeting"}</button><Link href="/meetings" className="text-blue-800 underline">Cancel</Link></div>
  </form>;
}
