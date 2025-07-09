import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/config/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 403 }
    );
  }

  try {
    const user = await User.findById(params.id).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching user" },
      { status: 500 }
    );
  }
}
