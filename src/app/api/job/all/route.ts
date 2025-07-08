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
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = parseInt(pageParam || "1", 10);
    const limit = parseInt(limitParam || "6", 10);
    const skip = (page - 1) * limit;

    if (companyId?.trim()) {
      filters.company = companyId.trim();
    }

    if (title?.trim()) {
      filters.title = { $regex: title.trim(), $options: "i" };
    }

    if (location?.trim()) {
      filters.location = { $regex: location.trim(), $options: "i" };
    }

    if (expParam !== null) {
      const experience = parseInt(expParam, 10);
      if (!isNaN(experience)) {
        filters.experience = { $lte: experience };
      }
    }

    const totalJobs = await Job.countDocuments(filters);
    const totalPages = Math.ceil(totalJobs / limit);

    const jobs = await Job.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      jobs,
      totalPages,
      currentPage: page,
      totalJobs,
    });
  } catch (error: any) {
    console.error("Error fetching paginated jobs:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch jobs",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
