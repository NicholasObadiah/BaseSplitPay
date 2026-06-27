"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Split" },
  { href: "/review", label: "Review" },
  { href: "/about", label: "About" }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Bottom Navigation">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={`nav-item ${pathname === item.href ? "active" : ""}`}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
