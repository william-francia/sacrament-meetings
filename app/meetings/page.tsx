"use client";

import { useEffect, useState } from "react";
import MeetingCard from "@/components/MeetingCard";
import type { SacramentMeeting } from "@/lib/types";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<SacramentMeeting[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMeetings() {
      try {
        const response = await fetch("/api/meetings", { signal: controller.signal });
        if (!response.ok) throw new Error("Could not load meetings");
        const data: SacramentMeeting[] = await response.json();
        setMeetings(data);
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }

    void loadMeetings();
    return () => controller.abort();
  }, []);

  return (
    <section>
      <h1 className="text-3xl font-bold">Meetings</h1>
      {error ? (
        <p role="alert" className="mt-4">Unable to load meetings. Please try again later.</p>
      ) : meetings === null ? (
        <p role="status" className="mt-4">Loading meetings...</p>
      ) : meetings.length === 0 ? (
        <p className="mt-4">No meetings are available.</p>
      ) : (
        <section className="mt-6">
          <h2 className="mb-4 text-xl font-semibold">Meeting programs</h2>
          <div className="grid gap-4">
            {meetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}
          </div>
        </section>
      )}
    </section>
  );
}
