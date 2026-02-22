import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import DashboardNav from "./DashboardNav";

export const metadata: Metadata = { title: "Личный кабинет | СпецАренда" };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <nav className="flex items-center gap-1 text-sm text-stone-500 mb-3">
            <Link href="/" className="hover:text-stone-700">
              Главная
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-stone-900 font-medium">Личный кабинет</span>
          </nav>
          <h1 className="text-2xl font-bold text-stone-900">
            Добро пожаловать, {session.user.firstName ?? session.user.name}!
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-6">
          <aside className="sm:w-56 shrink-0">
            <DashboardNav />
          </aside>
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
