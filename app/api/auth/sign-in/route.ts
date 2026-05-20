import { NextRequest, NextResponse } from "next/server"

// Mock user database (demo only)
const mockUsers = new Map([
  ["test@example.com", { id: "1", name: "Test User", email: "test@example.com", password: "TestPass123!" }],
  ["demo@example.com", { id: "2", name: "Demo User", email: "demo@example.com", password: "DemoPass123!" }],
]);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = mockUsers.get(email.toLowerCase());
    
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

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
