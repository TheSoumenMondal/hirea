import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import Job from "@/models/Job";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("id");
    if (!companyId) {
      return NextResponse.json(
        { message: "Company ID is required" },
        { status: 400 }
      );
    }

    const filters: Record<string, any> = {
      company: companyId,
    };

    const title = searchParams.get("title");
    if (title && title.trim() !== "") {
      filters.title = { $regex: title.trim(), $options: "i" };
    }

    const location = searchParams.get("location");
    if (location && location.trim() !== "") {
      filters.location = { $regex: location.trim(), $options: "i" };
    }

    const expParam = searchParams.get("experience");
    if (expParam !== null) {
      const experience = parseInt(expParam, 10);
      if (!isNaN(experience)) {
        filters.experience = { $lte: experience };
      }
    }

    const [jobs, topSix, locations] = await Promise.all([
      Job.find(filters).sort({ createdAt: -1 }),
      Job.find({ company: companyId }).sort({ createdAt: -1 }).limit(6),
      Job.distinct("location", { company: companyId }),
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
