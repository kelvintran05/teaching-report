import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      date,
      schoolName,
      session: sessionTime,
      period,
      className,
      lessonName,
      ta,
      classStatus,
      selfEvaluation,
      taComment
    } = body

    // Check ownership
    const existing = await prisma.activity.findUnique({
      where: { id: params.id }
    })

    if (!existing || existing.userId !== (session.user as any).id) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      )
    }

    const activity = await prisma.activity.update({
      where: { id: params.id },
      data: {
        date: new Date(date),
        schoolName,
        session: sessionTime,
        period,
        className,
        lessonName,
        ta,
        classStatus,
        selfEvaluation,
        taComment
      }
    })

    return NextResponse.json({ activity })
  } catch (error) {
    console.error("Update activity error:", error)
    return NextResponse.json(
      { error: "Failed to update activity" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check ownership
    const existing = await prisma.activity.findUnique({
      where: { id: params.id }
    })

    if (!existing || existing.userId !== (session.user as any).id) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      )
    }

    await prisma.activity.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete activity error:", error)
    return NextResponse.json(
      { error: "Failed to delete activity" },
      { status: 500 }
    )
  }
}

