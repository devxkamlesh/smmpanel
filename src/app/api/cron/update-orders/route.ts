import { updateOrderStatuses } from "@/lib/cron/update-order-status";
import { NextResponse } from "next/server";

/**
 * API endpoint for cron job to update order statuses
 * Call this endpoint every 5-10 minutes from a cron service
 * 
 * Example with Vercel Cron:
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/update-orders",
 *     "schedule": "*/5 * * * *"
 *   }]
 * }
 * 
 * Or use external cron service like cron-job.org
 */
export async function GET(request: Request) {
  try {
    // Optional: Add authorization header check
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await updateOrderStatuses();

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[CRON API] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Allow POST as well for flexibility
export async function POST(request: Request) {
  return GET(request);
}
