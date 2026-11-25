"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MeetingSearch({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("query") ?? "";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() === urlQuery) return;
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) params.set("query", query.trim());
      else params.delete("query");
      params.set("page", "1");
      router.replace(`${pathname}${params.size ? `?${params}` : ""}`);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, pathname, router, searchParams, urlQuery]);

  return (
    <div>
      <label htmlFor="meeting-search" className="block font-semibold text-slate-800">Search meetings</label>
      <input
        id="meeting-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Speaker, presiding, conducting, or type"
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus-visible:border-teal-700"
      />
    </div>
  );
}
