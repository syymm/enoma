import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyJWT } from '../../../../lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comic = await prisma.comic.findUnique({
      where: { id: params.id },
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

    if (!comic) {
      return NextResponse.json(
        { error: 'Comic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ comic });
  } catch (error) {
    console.error('Error fetching comic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comic' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await verifyJWT(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const comicId = params.id;
    
    // Check if comic exists and belongs to user
    const existingComic = await prisma.comic.findUnique({
      where: { id: comicId }
    });

    if (!existingComic) {
      return NextResponse.json(
        { error: 'Comic not found' },
        { status: 404 }
      );
    }

    if (existingComic.userId !== payload.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      thumbnail,
      imageUrl,
      color,
      price,
      episode,
      description,
      tags,
      isPublic
    } = body;

    const comic = await prisma.comic.update({
      where: { id: comicId },
      data: {
        ...(title && { title }),
        ...(thumbnail && { thumbnail }),
        ...(imageUrl && { imageUrl }),
        ...(color && { color }),
        ...(price && { price }),
        ...(episode !== undefined && { episode }),
        ...(description !== undefined && { description }),
        ...(tags && { tags }),
        ...(isPublic !== undefined && { isPublic })
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

    return NextResponse.json({ comic });
  } catch (error) {
    console.error('Error updating comic:', error);
    return NextResponse.json(
      { error: 'Failed to update comic' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await verifyJWT(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const comicId = params.id;
    
    // Check if comic exists and belongs to user
    const existingComic = await prisma.comic.findUnique({
      where: { id: comicId }
    });

    if (!existingComic) {
      return NextResponse.json(
        { error: 'Comic not found' },
        { status: 404 }
      );
    }

    if (existingComic.userId !== payload.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await prisma.comic.delete({
      where: { id: comicId }
    });

    return NextResponse.json({ message: 'Comic deleted successfully' });
  } catch (error) {
    console.error('Error deleting comic:', error);
    return NextResponse.json(
      { error: 'Failed to delete comic' },
      { status: 500 }
    );
  }
}