import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activities = await prisma.activity.findMany({
      where: {
        userId: (session.user as any).id,
      },
      orderBy: {
        date: "desc",
      },
    });

    // Convert className from comma-separated string to array
    const activitiesWithArrays = activities.map((activity) => ({
      ...activity,
      className: activity.className.split(","),
    }));

    return NextResponse.json({ activities: activitiesWithArrays });
  } catch (error) {
    console.error("Get activities error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
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
      taComment,
    } = body;

    // Convert className array to comma-separated string
    const classNameStr = Array.isArray(className)
      ? className.join(",")
      : className;

    const activity = await prisma.activity.create({
      data: {
        userId: (session.user as any).id,
        date: new Date(date),
        schoolName,
        session: sessionTime,
        period,
        className: classNameStr,
        lessonName,
        ta,
        classStatus,
        selfEvaluation,
        taComment,
      },
    });

    // Convert back to array for response
    const activityWithArray = {
      ...activity,
      className: activity.className.split(","),
    };

    return NextResponse.json({ activity: activityWithArray }, { status: 201 });
  } catch (error) {
    console.error("Create activity error:", error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}
