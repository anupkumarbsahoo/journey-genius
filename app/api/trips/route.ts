import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateShareToken } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    include: { waypoints: { orderBy: { order: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ trips });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, fromLocation, toLocation, startDate, endDate, budget, description } = body;

  if (!title || !fromLocation || !toLocation) {
    return NextResponse.json({ error: "title, fromLocation, toLocation required" }, { status: 400 });
  }

  const trip = await prisma.trip.create({
    data: {
      userId: session.user.id,
      title,
      fromLocation,
      toLocation,
      description,
      budget: budget ? parseFloat(budget) : null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      shareToken: generateShareToken(),
    },
  });

  return NextResponse.json({ trip }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const trip = await prisma.trip.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

  await prisma.trip.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
