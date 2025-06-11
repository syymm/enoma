import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Mock validation - replace with your actual authentication logic
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Mock authentication - replace with your actual authentication logic
    if (email === 'test@example.com' && password === 'password') {
      const user = {
        id: '1',
        email: email,
        name: 'Test User',
      };

      return NextResponse.json({ 
        user,
        message: 'Login successful' 
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}