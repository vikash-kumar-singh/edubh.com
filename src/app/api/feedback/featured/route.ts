import { NextResponse } from "next/server";
import { fetchFiveStarFeedback } from "@/lib/firebase-db";

export async function GET() {
  try {
    const result = await fetchFiveStarFeedback();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Unable to load feedback.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data || [],
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Featured feedback API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to load feedback.",
      },
      { status: 500 },
    );
  }
}