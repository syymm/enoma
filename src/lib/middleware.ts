import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, JWTPayload } from './auth';

export function adminOnly(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const adminPayload = requireAdmin(req);
    
    if (!adminPayload) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    return handler(req);
  };
}

export function withAdminAuth<T extends unknown[]>(
  handler: (req: NextRequest, adminPayload: JWTPayload, ...args: T) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: T) => {
    const adminPayload = requireAdmin(req);
    
    if (!adminPayload) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    return handler(req, adminPayload, ...args);
  };
}

export function withAdminAuthSimple(handler: (...args: unknown[]) => Promise<NextResponse>) {
  return async (req: NextRequest, ...args: unknown[]) => {
    const adminPayload = requireAdmin(req);
    
    if (!adminPayload) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    return handler(req, ...args);
  };
}