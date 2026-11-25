"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MeetingSearch({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() === (searchParams.get("query") ?? "")) return;
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) params.set("query", query.trim());
      else params.delete("query");
      params.set("page", "1");
      router.replace(`${pathname}${params.size ? `?${params}` : ""}`);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, pathname, router, searchParams]);

  return (
    <div className="mt-4">
      <label htmlFor="meeting-search" className="block font-medium">Search meetings</label>
      <input
        id="meeting-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Speaker, presiding, conducting, or type"
        className="mt-1 w-full rounded border px-3 py-2"
      />
    </div>
  );
}
