import { connectDB } from "@/config/db";
import Company from "@/models/Company";
import Job from "@/models/Job";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthPayload extends JwtPayload {
  id: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded: AuthPayload;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const recruiterId = decoded.id;

    const searchParams = new URL(req.url).searchParams;
    const companyId = searchParams.get("id");

    if (!companyId) {
      return NextResponse.json(
        { message: "Company ID is required" },
        { status: 400 }
      );
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return NextResponse.json(
        { message: "No company found with this ID." },
        { status: 404 }
      );
    }

    if (company.recruiter.toString() !== recruiterId) {
      return NextResponse.json(
        { message: "You are not authorized to post jobs for this company." },
        { status: 403 }
      );
    }

    const { title, description, role, salary, experience, location, openings } =
      await req.json();

    const newJob = await Job.create({
      title,
      description,
      role,
      salary,
      experience,
      location,
      openings,
      company: company._id,
      companyLogo: company.logo,
      recruiter: recruiterId,
    });

    return NextResponse.json(
      {
        message: "Job posted successfully",
        job: newJob,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error posting job:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
