import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function GET() {
  const startedAt = Date.now();

  try {
    const users = await prisma.user.count();

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      database: {
        status: "connected",
        responseTime: Date.now() - startedAt,
        users,
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: {
          status: "disconnected",
          responseTime: Date.now() - startedAt,
          error:
            error instanceof Error ? error.message : "Unknown database error",
        },
      },
      { status: 503 },
    );
  }
}
