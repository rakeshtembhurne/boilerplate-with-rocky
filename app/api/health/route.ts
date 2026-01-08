import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { performance } from "perf_hooks"

// Define types for health response
interface HealthCheckResponse {
  status: "healthy" | "unhealthy"
  timestamp: string
  uptime: number
  database: {
    status: "connected" | "disconnected"
    responseTime: number
    error?: string
  }
  timestampISO: string
}

export async function GET() {
  const startTime = performance.now()
  const healthy: HealthCheckResponse = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: "connected",
      responseTime: 0,
    },
    timestampISO: new Date().toISOString(),
  }

  try {
    // Test database connection with a simple query
    const dbStartTime = performance.now()
    await prisma.$executeRaw`SELECT 1`
    const dbEndTime = performance.now()

    healthy.database.responseTime = Math.round(dbEndTime - dbStartTime)

    // Also try to get a count of a simple table to ensure full connectivity
    try {
      // Use raw SQL to avoid model naming issues
      await prisma.$executeRaw`SELECT COUNT(*) FROM users`
    } catch (error) {
      // If count fails but SELECT 1 worked, we'll still report as connected
      // This might indicate permission issues but basic connectivity works
      console.warn("Health check: User count query failed but database is accessible", error)
    }

    const totalTime = Math.round(performance.now() - startTime)

    return NextResponse.json({
      ...healthy,
      responseTime: totalTime,
    })

  } catch (error) {
    const endTime = performance.now()
    const totalTime = Math.round(endTime - startTime)

    const unhealthy: HealthCheckResponse = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: "disconnected",
        responseTime: totalTime,
        error: error instanceof Error ? error.message : "Unknown database error",
      },
      timestampISO: new Date().toISOString(),
    }

    // Log the error for debugging
    console.error("Health check failed:", error)

    return NextResponse.json(unhealthy, { status: 503 })
  }
}

// Optional: POST endpoint for health checks if needed
export async function POST() {
  return GET()
}