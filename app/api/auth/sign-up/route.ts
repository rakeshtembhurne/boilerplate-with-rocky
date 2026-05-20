import { NextRequest, NextResponse } from "next/server"

// Mock user database (demo only)
const mockUsers = new Map<string, { id: string; name: string; email: string; password: string }>();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase();
    
    if (mockUsers.has(emailLower)) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Create new user
    const user = {
      id: "user-" + Date.now(),
      name,
      email: emailLower,
      password,
    };
    
    mockUsers.set(emailLower, user);

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
