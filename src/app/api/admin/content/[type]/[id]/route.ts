import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { withAdminAuth } from '../../../../../../lib/middleware';
import { JWTPayload } from '../../../../../../lib/auth';

async function updateContentHandler(
  request: NextRequest, 
  adminPayload: JWTPayload,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const { type, id } = params;
    const data = await request.json();

    if (type !== 'gallery' && type !== 'comic') {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    let result;
    
    if (type === 'gallery') {
      result = await prisma.gallery.update({
        where: { id: parseInt(id) },
        data: {
          title: data.title,
          price: data.price,
          description: data.description,
          tags: data.tags,
          color: data.color,
          isPublic: data.isPublic,
        },
      });
    } else {
      result = await prisma.comic.update({
        where: { id },
        data: {
          title: data.title,
          price: data.price,
          description: data.description,
          tags: data.tags,
          color: data.color,
          episode: data.episode,
          isPublic: data.isPublic,
        },
      });
    }

    return NextResponse.json({
      message: 'Content updated successfully',
      data: result,
    });

  } catch (error) {
    console.error('Update content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function deleteContentHandler(
  request: NextRequest,
  adminPayload: JWTPayload,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const { type, id } = params;

    if (type !== 'gallery' && type !== 'comic') {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    if (type === 'gallery') {
      await prisma.gallery.delete({
        where: { id: parseInt(id) },
      });
    } else {
      await prisma.comic.delete({
        where: { id },
      });
    }

    return NextResponse.json({
      message: 'Content deleted successfully',
    });

  } catch (error) {
    console.error('Delete content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const PUT = withAdminAuth(updateContentHandler);
export const DELETE = withAdminAuth(deleteContentHandler);