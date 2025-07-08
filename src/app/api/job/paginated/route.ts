import { connectDB } from "@/config/db";
import Job from "@/models/Job";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalJobs = await Job.countDocuments();

    return NextResponse.json(
      {
        message: "Jobs fetched successfully",
        jobs,
        page,
        totalPages: Math.ceil(totalJobs / limit),
        totalJobs,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch jobs",
      },
      { status: 400 }
    );
  }
}
