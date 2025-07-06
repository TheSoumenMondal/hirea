import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/config/db";
import { sanitizeUser } from "@/lib/sanitizeUser";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "5d",
    });

    const finalUser = sanitizeUser(user);

    const response = NextResponse.json(
      {
        message: `Welcome back ${user.name}`,
        user: finalUser,
      },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 5,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
