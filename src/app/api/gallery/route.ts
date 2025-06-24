import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyJWT } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isPublic = searchParams.get('public') === 'true';
    const userId = searchParams.get('userId');
    
    // Check if user is admin for admin panel requests
    const payload = verifyJWT(request);
    const isAdminRequest = payload && payload.role === 'ADMIN' && !isPublic && !userId;
    
    const where: Record<string, any> = {};
    
    if (isPublic) {
      where.isPublic = true;
    } else if (userId) {
      where.userId = userId;
    } else if (isAdminRequest) {
      // Admin can see their own content (both public and private)
      where.userId = payload.userId;
    } else {
      // Default to public only for unauthorized requests
      where.isPublic = true;
    }

    const galleries = await prisma.gallery.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ galleries });
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch galleries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await verifyJWT(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      thumbnail,
      imageUrl,
      color,
      price,
      description,
      tags,
      isPublic = true
    } = body;

    if (!title || !thumbnail || !imageUrl || !color || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const gallery = await prisma.gallery.create({
      data: {
        title,
        thumbnail,
        imageUrl,
        color,
        price,
        description,
        tags: tags || [],
        isPublic,
        userId: payload.userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ gallery }, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery' },
      { status: 500 }
    );
  }
}