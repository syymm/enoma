import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { adminOnly } from '../../../../lib/middleware';

async function getContentHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'gallery', 'comic', or null for both
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    let galleries = [];
    let comics = [];
    let totalGalleries = 0;
    let totalComics = 0;

    if (!type || type === 'gallery') {
      [galleries, totalGalleries] = await Promise.all([
        prisma.gallery.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        }),
        prisma.gallery.count()
      ]);
    }

    if (!type || type === 'comic') {
      [comics, totalComics] = await Promise.all([
        prisma.comic.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        }),
        prisma.comic.count()
      ]);
    }

    return NextResponse.json({
      galleries,
      comics,
      pagination: {
        page,
        limit,
        totalGalleries,
        totalComics,
        totalPagesGalleries: Math.ceil(totalGalleries / limit),
        totalPagesComics: Math.ceil(totalComics / limit),
      }
    });

  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = adminOnly(getContentHandler);