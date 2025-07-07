import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Missing token" }, { status: 400 });
    }

    let decodedData: JwtPayload;
    try {
      decodedData = jwt.verify(token, process.env.FORGET_EMAIL_SECRET!) as JwtPayload;
    } catch (err) {
      console.error("JWT verification error:", err);
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    const user = await User.findOne({ email: decodedData.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.resetToken !== token) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    if (!user.resetPasswordExpire || user.resetPasswordExpire < Date.now()) {
      return NextResponse.json({ message: "Token expired" }, { status: 400 });
    }

    const body = await req.json();
    const password = body.password;

    if (!password) {
      return NextResponse.json({ message: "Password is required" }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 10);

    user.password = hash;
    user.resetPasswordExpire = null;
    user.resetToken = null;

    await user.save();

    return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in reset API:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
