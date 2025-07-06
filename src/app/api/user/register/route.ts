import { connectDB } from "@/config/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sanitizeUser } from "@/lib/sanitizeUser";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password, phoneNumber, role } = body;

    if (!name || !email || !password || !phoneNumber || !role) {
      return NextResponse.json(
        { message: "All information are required." },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashPassword,
      phoneNumber,
      role,
    });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not set");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    const safeUser = sanitizeUser(user);

    const response = NextResponse.json(
      {
        message: "Registration Successful",
        user: safeUser,
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 5,
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Error Creating User" },
      { status: 400 }
    );
  }
}
