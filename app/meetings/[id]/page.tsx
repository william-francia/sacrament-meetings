"use client";

import { use, useEffect, useState } from "react";
import MeetingDetail from "@/components/MeetingDetail";
import type { SacramentMeeting } from "@/lib/types";

export default function MeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <MeetingContent key={id} id={id} />;
}

function MeetingContent({ id }: { id: string }) {
  const [meeting, setMeeting] = useState<SacramentMeeting | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMeeting() {
      try {
        const response = await fetch(`/api/meetings/${encodeURIComponent(id)}`, {
          signal: controller.signal,
        });
        if (response.status === 400 || response.status === 404) {
          setError("Meeting not found.");
          return;
        }
        if (!response.ok) throw new Error("Could not load meeting");
        const data: SacramentMeeting = await response.json();
        setMeeting(data);
      } catch {
        if (!controller.signal.aborted) setError("Unable to load the meeting. Please try again later.");
      }
    }

    void loadMeeting();
    return () => controller.abort();
  }, [id]);

  if (error) return <p role="alert">{error}</p>;
  if (!meeting) return <p role="status">Loading meeting...</p>;
  return <MeetingDetail meeting={meeting} />;
}
