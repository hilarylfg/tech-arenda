"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, User, ChevronRight } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Обзор", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Мои заявки", icon: ClipboardList },
  { href: "/dashboard/profile", label: "Профиль", icon: User },
];

export default function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      {navItems.map((item) => {
        const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              "flex items-center gap-3 px-4 py-3 text-sm font-medium border-b border-stone-100 last:border-0 transition-colors " +
              (active
                ? "bg-amber-50 text-amber-700"
                : "text-stone-700 hover:bg-amber-50 hover:text-amber-700")
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
