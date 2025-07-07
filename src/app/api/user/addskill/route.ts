import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/config/db";
import { sanitizeUser } from "@/lib/sanitizeUser";

export async function PUT(req: NextRequest) {
  await connectDB();

  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Invalid Token" }, { status: 400 });
    }

    const decodedValue = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    const userId = decodedValue.id;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { skills } = body;

    if (!skills || typeof skills !== "string") {
      return NextResponse.json(
        { message: "Invalid or missing skills data" },
        { status: 400 }
      );
    }

    const parsedSkills = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "")
      .slice(0, 6);

    user.skills = parsedSkills;
    await user.save();

    const finalUser = sanitizeUser(user);

    return NextResponse.json(
      { message: "Skills updated successfully", user: finalUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating skills:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
