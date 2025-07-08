import { connectDB } from "@/config/db";
import Job from "@/models/Job";
import User from "@/models/User";
import Application from "@/models/Applicantion";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const userId = decoded?.id;
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 401 }
      );
    }
    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json(
        { message: "Job ID is required" },
        { status: 400 }
      );
    }
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }
    if (job.status !== "open") {
      return NextResponse.json(
        { message: "This job is not open for applications" },
        { status: 400 }
      );
    }

    const alreadyApplied = await Application.exists({
      applicant: userId,
      job: jobId,
    });
    if (alreadyApplied) {
      return NextResponse.json(
        { message: "You have already applied for this job" },
        { status: 400 }
      );
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
      jobName: job.title,
      jobSalary: job.salary,
    });

    await job.applications.push(newApplication._id);
    await job.save();

    return NextResponse.json(
      { message: "Application submitted successfully", newApplication },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error applying to job:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
