import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("brandsome_session");
  
  if (!sessionCookie?.value) {
    return NextResponse.json({ session: null });
  }
  
  try {
    const user = JSON.parse(decodeURIComponent(sessionCookie.value));
    return NextResponse.json({ session: { user } });
  } catch {
    return NextResponse.json({ session: null });
  }
}
