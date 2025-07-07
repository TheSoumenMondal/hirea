// pages/api/company/new.ts
import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/User";
import Company from "@/models/Company";
import uploadFile from "@/lib/cloudinary_upload";

interface AuthPayload extends JwtPayload {
  id: string;
}

export async function POST(req: NextRequest) {
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
        { message: "Access denied. Recruiters only." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const name = formData.get("name")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const location = formData.get("location")?.toString().trim();
    const website = formData.get("website")?.toString().trim();
    const logoFile = formData.get("logo") as File | null;

    if (!name || !description || !location || !website) {
      return NextResponse.json(
        { message: "All fields except logo are required." },
        { status: 400 }
      );
    }

    const existing = await Company.countDocuments({ recruiter: user._id });
    if (existing >= 5) {
      return NextResponse.json(
        { message: "You can only create up to 5 companies." },
        { status: 400 }
      );
    }

    const duplicate = await Company.findOne({
      recruiter: user._id,
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (duplicate) {
      return NextResponse.json(
        { message: "You already have a company with this name." },
        { status: 409 }
      );
    }

    let logoUrl = "";
    if (logoFile && logoFile.size > 0) {
      try {
        const uploaded = await uploadFile(logoFile);
        logoUrl = uploaded.secure_url;
      } catch (uploadErr: any) {
        console.error("Upload failed:", uploadErr);
        return NextResponse.json(
          { message: "Failed to upload logo. Try again." },
          { status: 500 }
        );
      }
    }

    const newCompany = await Company.create({
      name,
      description,
      location,
      website,
      logo: logoUrl,
      recruiter: user._id,
    });

    return NextResponse.json(
      { message: "Company created successfully.", company: newCompany },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}
