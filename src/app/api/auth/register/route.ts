import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    
    // Mock validation - replace with your actual registration logic
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Mock registration - replace with your actual registration logic
    // In a real app, you would check if user exists, hash password, save to database, etc.
    const user = {
      id: Date.now().toString(),
      email: email,
      name: name || email.split('@')[0],
    };

    return NextResponse.json({ 
      user,
      message: 'Registration successful' 
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}