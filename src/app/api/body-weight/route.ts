import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const where: any = { userId: session.user.id }

    if (from || to) {
      where.recordedAt = {}
      if (from) where.recordedAt.gte = new Date(from)
      if (to) where.recordedAt.lte = new Date(to)
    }

    const logs = await prisma.bodyWeightLog.findMany({
      where,
      orderBy: { recordedAt: "asc" },
    })

    // Map Prisma Decimal to number so it serializes properly via JSON
    const serializedLogs = logs.map((log) => ({
      ...log,
      weight: Number(log.weight),
    }))

    return NextResponse.json(serializedLogs)
  } catch (error) {
    console.error("GET /api/body-weight error:", error)
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { weight, recordedAt, note } = body

    if (weight === undefined || !recordedAt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const log = await prisma.bodyWeightLog.create({
      data: {
        userId: session.user.id,
        weight,
        recordedAt: new Date(recordedAt),
        note,
      },
    })

    return NextResponse.json(
      {
        ...log,
        weight: Number(log.weight),
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A log for this exact time already exists" },
        { status: 409 }
      )
    }
    console.error("POST /api/body-weight error:", error)
    return NextResponse.json({ error: "Failed to create log" }, { status: 500 })
  }
}
