import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "������ ��������" }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const pageSize = parseInt(searchParams.get("pageSize") ?? "20");
    const status = searchParams.get("status");
    const where = status ? { status: status as "PENDING" | "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED" } : {};
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { firstName: true, lastName: true, email: true, phone: true } },
          items: { include: { equipment: { select: { id: true, name: true, images: true } } } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.order.count({ where }),
    ]);
    return NextResponse.json({ success: true, data: { orders, total, page, pageSize } });
  } catch (error) {
    console.error("[ADMIN/ORDERS GET]:", error);
    return NextResponse.json({ success: false, error: "���������� ������ �������" }, { status: 500 });
  }
}
