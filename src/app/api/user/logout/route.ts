import { NextResponse } from "next/server";

export async function GET() {
  // Clear the 'token' cookie by setting it to expire immediately
  return NextResponse.json(
    { message: "Logged out successfully" },
    {
      status: 200,
      headers: {
        "Set-Cookie": `token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
      },
    }
  );
}
