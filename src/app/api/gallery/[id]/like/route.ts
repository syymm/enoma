import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const galleryId = parseInt(params.id);
    const body = await request.json();
    const { increment } = body; // true for like, false for unlike

    if (typeof increment !== 'boolean') {
      return NextResponse.json(
        { error: 'increment field is required and must be boolean' },
        { status: 400 }
      );
    }

    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId }
    });

    if (!gallery) {
      return NextResponse.json(
        { error: 'Gallery not found' },
        { status: 404 }
      );
    }

    const updatedGallery = await prisma.gallery.update({
      where: { id: galleryId },
      data: {
        likesCount: {
          increment: increment ? 1 : -1
        }
      }
    });

    return NextResponse.json({ 
      likesCount: updatedGallery.likesCount 
    });
  } catch (error) {
    console.error('Error updating gallery likes:', error);
    return NextResponse.json(
      { error: 'Failed to update likes' },
      { status: 500 }
    );
  }
}