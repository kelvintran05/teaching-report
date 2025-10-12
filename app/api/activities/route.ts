import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const activities = await prisma.activity.findMany({
      where: {
        userId: (session.user as any).id
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Get activities error:", error)
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
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

    const activity = await prisma.activity.create({
      data: {
        userId: (session.user as any).id,
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

    return NextResponse.json({ activity }, { status: 201 })
  } catch (error) {
    console.error("Create activity error:", error)
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    )
  }
}

