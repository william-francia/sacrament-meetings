
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
    <nav aria-label="Main navigation" className="flex flex-wrap gap-4">
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
            className={active ? "font-bold underline" : "hover:underline"}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
