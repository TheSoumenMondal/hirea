import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/config/db";
import User from "@/models/User";
import uploadFile from "@/lib/cloudinary_upload";


export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Invalid token, please log in again" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(
        { message: "Token verification failed" },
        { status: 403 }
      );
    }

    const userId = decoded.id;

    const formData = await request.formData();

    const name = formData.get("name")?.toString();
    const bio = formData.get("bio")?.toString();
    const phoneNumber = formData.get("phoneNumber")?.toString();
    const socialMediaProfilesRaw = formData.get("socialMediaProfiles");

    let socialMediaProfiles;
    if (typeof socialMediaProfilesRaw === "string") {
      try {
        socialMediaProfiles = JSON.parse(socialMediaProfilesRaw);
      } catch (error) {
        return NextResponse.json(
          { message: "Invalid social media format" },
          { status: 400 }
        );
      }
    }

    // File uploads
    const profilePhotoFile = formData.get("profilePhoto") as File | null;
    const resumeFile = formData.get("resume") as File | null;

    let profilePhotoUrl: string | undefined;
    let resumeUrl: string | undefined;

    if (profilePhotoFile && typeof profilePhotoFile === "object") {
      const uploadResult = await uploadFile(profilePhotoFile);
      profilePhotoUrl = uploadResult.secure_url;
    }

    if (resumeFile && typeof resumeFile === "object") {
      const uploadResult = await uploadFile(resumeFile);
      resumeUrl = uploadResult.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(phoneNumber && { phoneNumber }),
        ...(resumeUrl && { resume: resumeUrl }),
        ...(profilePhotoUrl && { profilePhoto: profilePhotoUrl }),
        ...(socialMediaProfiles && { socialMediaProfiles }),
      },
      { new: true }
    ).select("-password -resetToken -resetPasswordExpire");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
