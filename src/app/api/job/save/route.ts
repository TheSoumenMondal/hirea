import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/User";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    const userId = decodedToken?.id;
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { jobid } = body;

    if (!jobid) {
      return NextResponse.json(
        { message: "Job ID is required" },
        { status: 400 }
      );
    }

    const alreadySaved = user.savedJobs?.includes(jobid);

    if (alreadySaved) {
      // ❌ Remove job from savedJobs
      await User.findByIdAndUpdate(userId, {
        $pull: { savedJobs: jobid },
      });

      return NextResponse.json(
        { message: "Job removed from saved list", removed: true },
        { status: 200 }
      );
    } else {
      // ✅ Add job to savedJobs
      await User.findByIdAndUpdate(userId, {
        $addToSet: { savedJobs: jobid },
      });

      return NextResponse.json(
        { message: "Job saved successfully", removed: false },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Save Job Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
