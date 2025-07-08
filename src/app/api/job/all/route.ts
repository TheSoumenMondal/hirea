import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import Job from "@/models/Job";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const filters: Record<string, any> = {};

    const companyId = searchParams.get("company");
    const title = searchParams.get("title");
    const location = searchParams.get("location");
    const expParam = searchParams.get("experience");

    // Add dynamic filters
    if (companyId && companyId.trim() !== "") {
      filters.company = companyId.trim();
    }

    if (title && title.trim() !== "") {
      filters.title = { $regex: title.trim(), $options: "i" };
    }

    if (location && location.trim() !== "") {
      filters.location = { $regex: location.trim(), $options: "i" };
    }

    if (expParam !== null) {
      const experience = parseInt(expParam, 10);
      if (!isNaN(experience)) {
        filters.experience = { $lte: experience };
      }
    }

    const [jobs, topSix, locations] = await Promise.all([
      Job.find(filters).sort({ createdAt: -1 }),
      Job.find(filters).sort({ createdAt: -1 }).limit(6),
      Job.distinct("location", companyId ? { company: companyId } : {}),
    ]);

    return NextResponse.json({ jobs, topSix, locations });
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch jobs",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
