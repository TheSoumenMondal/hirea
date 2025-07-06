import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sendMail } from "@/lib/sendmail";
import { connectDB } from "@/config/db";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "No user found with this email." },
        { status: 404 }
      );
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.FORGET_EMAIL_SECRET!,
      { expiresIn: "5m" }
    );

    user.resetPasswordExpire = new Date(Date.now() + 5 * 60 * 1000);
    user.resetToken = token;
    
    console.log("Before Save:", user);
    await user.save();
    console.log("After Save:", await User.findOne({ email }));


    await sendMail("hirea", {
      email: user.email,
      token,
    });

    return NextResponse.json(
      { message: "Reset password email sent successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in password reset:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
