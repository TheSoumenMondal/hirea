import { NextRequest, NextResponse } from "next/server";
import Company from "@/models/Company";
import { connectDB } from "@/config/db";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const url = req.url;

    console.log(url)
    const searchParams = new URL(url).searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Company ID is required" },
        { status: 400 }
      );
    }

    const company = await Company.findById(id);
    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ company }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching company:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
