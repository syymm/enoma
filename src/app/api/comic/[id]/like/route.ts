import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comicId = params.id;
    const body = await request.json();
    const { increment } = body; // true for like, false for unlike

    if (typeof increment !== 'boolean') {
      return NextResponse.json(
        { error: 'increment field is required and must be boolean' },
        { status: 400 }
      );
    }

    const comic = await prisma.comic.findUnique({
      where: { id: comicId }
    });

    if (!comic) {
      return NextResponse.json(
        { error: 'Comic not found' },
        { status: 404 }
      );
    }

    const updatedComic = await prisma.comic.update({
      where: { id: comicId },
      data: {
        likesCount: {
          increment: increment ? 1 : -1
        }
      }
    });

    return NextResponse.json({ 
      likesCount: updatedComic.likesCount 
    });
  } catch (error) {
    console.error('Error updating comic likes:', error);
    return NextResponse.json(
      { error: 'Failed to update likes' },
      { status: 500 }
    );
  }
}