import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/User";
import Company from "@/models/Company";

interface AuthPayload extends JwtPayload {
  id: string;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Authentication token missing." },
        { status: 401 }
      );
    }
    let decoded: AuthPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 401 }
      );
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    if (user.role !== "recruiter") {
      return NextResponse.json(
        { message: "Access denied. Recruiter only." },
        { status: 403 }
      );
    }
    const companies = await Company.find({ recruiter: decoded.id });
    return NextResponse.json(
      {
        message: "Companies fetched successfully.",
        companies,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
