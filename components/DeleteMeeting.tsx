"use client";
import { useActionState, useState } from "react";
import { deleteMeeting } from "@/lib/actions";
import { INITIAL_MEETING_FORM_STATE } from "@/lib/types";

export default function DeleteMeeting({ id }: { id: number }) {
  const [confirm, setConfirm] = useState(false);
  const [state, action, pending] = useActionState(deleteMeeting, INITIAL_MEETING_FORM_STATE);
  return <div className="no-print mt-6 border-t pt-5">
    {confirm ? <form action={action} className="flex flex-wrap items-center gap-3"><input type="hidden" name="id" value={id} /><span>Delete this meeting permanently?</span><button disabled={pending} className="rounded-lg bg-red-700 px-4 py-2 text-white disabled:opacity-50">{pending ? "Deleting…" : "Yes, delete"}</button><button type="button" onClick={() => setConfirm(false)} className="rounded-lg border px-4 py-2">Cancel</button></form> : <button type="button" onClick={() => setConfirm(true)} className="rounded-lg border border-red-700 px-4 py-2 text-red-800">Delete meeting</button>}
    <p role="status" aria-live="polite" className="mt-2 text-red-700">{state.message}</p>
  </div>;
}
