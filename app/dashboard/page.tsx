import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ClipboardList, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/types";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [orders, counts] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        items: { include: { equipment: true } },
      },
    }),
    prisma.order.groupBy({
      by: ["status"],
      where: { userId: session.user.id },
      _count: true,
    }),
  ]);

  const statusCount = (status: string) =>
    counts.find((c) => c.status === status)?._count ?? 0;

  const stats = [
    { label: "Всего заявок", value: orders.length > 0 ? counts.reduce((a, c) => a + c._count, 0) : 0, icon: ClipboardList, color: "text-amber-600 bg-amber-50" },
    { label: "В обработке", value: statusCount("PENDING") + statusCount("CONFIRMED"), icon: Clock, color: "text-blue-600 bg-blue-50" },
    { label: "Активные", value: statusCount("ACTIVE"), icon: CheckCircle2, color: "text-green-600 bg-green-50" },
    { label: "Отменённые", value: statusCount("CANCELLED"), icon: XCircle, color: "text-red-600 bg-red-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-stone-200 p-4">
            <div className={"inline-flex p-2 rounded-lg " + stat.color}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-bold text-stone-900">{stat.value}</p>
            <p className="text-sm text-stone-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Последние заявки */}
      <div className="bg-white rounded-xl border border-stone-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="font-semibold text-stone-900">Последние заявки</h2>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            Все заявки <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-stone-300 mb-3" />
            <p className="text-stone-500 mb-4">У вас ещё нет заявок</p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {orders.map((order) => {
              const firstItem = order.items[0];
              return (
                <li key={order.id}>
                  <Link
                    href={"/dashboard/orders/" + order.id}
                    className="flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-stone-900 truncate">
                        {firstItem?.equipment.name ?? "Заявка"}
                        {order.items.length > 1 && (
                          <span className="text-stone-400 font-normal"> +{order.items.length - 1} ед.</span>
                        )}
                      </p>
                      <p className="text-sm text-stone-500 mt-0.5">
                        {formatDate(order.startDate)}  {formatDate(order.endDate)}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={"inline-flex px-2 py-0.5 rounded-full text-xs font-medium " +
                          (ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS] ?? "bg-stone-100 text-stone-600")}
                      >
                        {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ?? order.status}
                      </span>
                      <span className="text-sm font-semibold text-stone-900">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-1">Нужна техника?</h3>
        <p className="text-amber-100 text-sm mb-4">Более 50 единиц спецтехники доступны прямо сейчас</p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-amber-700 rounded-lg text-sm font-semibold hover:bg-amber-50 transition-colors"
        >
          Открыть каталог <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
