import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { weight, recordedAt, note } = body

    // Ensure the log belongs to the user
    const existingLog = await prisma.bodyWeightLog.findUnique({
      where: { id }
    })

    if (!existingLog || existingLog.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const data: any = {}
    if (weight !== undefined) data.weight = weight
    if (recordedAt !== undefined) data.recordedAt = new Date(recordedAt)
    if (note !== undefined) data.note = note

    const updatedLog = await prisma.bodyWeightLog.update({
      where: { id },
      data
    })

    return NextResponse.json({
      ...updatedLog,
      weight: Number(updatedLog.weight)
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update log" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const existingLog = await prisma.bodyWeightLog.findUnique({
      where: { id }
    })

    if (!existingLog || existingLog.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.bodyWeightLog.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete log" }, { status: 500 })
  }
}
