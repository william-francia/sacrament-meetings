
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/meetings", label: "Meetings" },
    { href: "/meetings/current", label: "Current Meeting" },
  ];

  return (
    <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-5 sm:gap-8">
      {links.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : link.href === "/meetings"
              ? pathname.startsWith("/meetings") &&
                pathname !== "/meetings/current"
              : pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`border-b-[3px] pb-1 text-sm font-medium transition-colors hover:text-teal-200 sm:text-base ${active ? "border-teal-300 text-white" : "border-transparent text-slate-100"}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
