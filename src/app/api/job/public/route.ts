import { connectDB } from "@/config/db";
import Job from "@/models/Job";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(6);
    return NextResponse.json(
      {
        message: "Jobs fetched successfully",
        jobs,
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
