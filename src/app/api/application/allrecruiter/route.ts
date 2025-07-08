import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import Job from "@/models/Job";
import { connectDB } from "@/config/db";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    if (!decodedToken?.id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    const recruiterId = decodedToken.id;

    // Find all jobs by this recruiter and populate the applications if needed
    const jobs = await Job.find({ recruiter: recruiterId }).populate(
      "applications"
    );

    // Flatten all applications from all jobs
    const allApplications = jobs.flatMap((job) => job.applications);

    return NextResponse.json(
      { applications: allApplications },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching applications:", error.message);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
