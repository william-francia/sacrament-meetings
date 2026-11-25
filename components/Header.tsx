import { Suspense } from "react";
import NavLinks from "./NavLinks";
import CurrentDate from "./CurrentDate";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#21394d] px-5 py-5 text-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/40 text-2xl">▤</span>
          <div>
          <Link href="/" className="text-xl font-semibold tracking-tight sm:text-2xl">Sacrament Meeting Planner</Link>

          <p className="text-sm">
            Sample Ward |{" "}
            <Suspense fallback="Loading date...">
              <CurrentDate />
            </Suspense>
          </p></div>
        </div>

        <Suspense fallback={<span>Loading navigation...</span>}>
          <NavLinks />
        </Suspense>
      </div>
    </header>
  );
}
