
import HomeIntro from "@/components/HomeIntro";
import type { Metadata } from "next";

export const metadata: Metadata = { title: { absolute: "Sacrament Meeting Planner" }, description: "Explore and review sacrament meeting programs, including the current meeting.", alternates: { canonical: "/" } };

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <HomeIntro />
    </div>
  );
}
