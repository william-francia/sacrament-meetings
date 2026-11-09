import { Suspense } from "react";
import NavLinks from "./NavLinks";
import CurrentDate from "./CurrentDate";

export default function Header() {
  return (
    <header className="bg-blue-800 p-5 text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xl font-bold">
            Sacrament Meeting Planner
          </p>

          <p className="text-sm">
            Sample Ward |{" "}
            <Suspense fallback="Loading date...">
              <CurrentDate />
            </Suspense>
          </p>
        </div>

        <Suspense fallback={<span>Loading navigation...</span>}>
          <NavLinks />
        </Suspense>
      </div>
    </header>
  );
}
