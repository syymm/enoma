import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { withAdminAuthSimple } from '../../../../lib/middleware';

async function getStatsHandler() {
  try {
    const [totalGalleries, totalComics, totalUsers] = await Promise.all([
      prisma.gallery.count(),
      prisma.comic.count(),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      totalGalleries,
      totalComics,
      totalUsers,
    });

  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuthSimple(getStatsHandler);