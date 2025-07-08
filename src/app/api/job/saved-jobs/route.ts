import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/config/db";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: "Unauthorized Access.",
        },
        { status: 401 }
      );
    }

    let decodedToken: string | JwtPayload;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(
        {
          message: "Unauthorized Access.",
        },
        { status: 401 }
      );
    }

    const id = (decodedToken as JwtPayload).id;

    const savedJobs = await User.findById(id)
      .select("savedJobs")
      .populate("savedJobs");

    return NextResponse.json(
      {
        message: "Saved jobs fetched successfully.",
        savedJobs,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error.",
      },
      { status: 500 }
    );
  }
}
