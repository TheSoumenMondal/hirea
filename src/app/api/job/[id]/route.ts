import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Job from "@/models/Job";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Request Received");
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const id = params.id;
    console.log("Job ID:", id);

    if (!id) {
      return NextResponse.json({ message: "Invalid job ID" }, { status: 400 });
    }

    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Job fetched successfully",
        job,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Request Came");
    console.error("Job fetch error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
