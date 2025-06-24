import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { verifyJWT } from '../../../../../lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await verifyJWT(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const galleryId = parseInt(resolvedParams.id);
    const { imageIndex } = await request.json();
    
    // Check if gallery exists and belongs to user
    const existingGallery = await prisma.gallery.findUnique({
      where: { id: galleryId }
    });

    if (!existingGallery) {
      return NextResponse.json(
        { error: 'Gallery not found' },
        { status: 404 }
      );
    }

    if (existingGallery.userId !== payload.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Check if image index is valid
    if (imageIndex < 0 || imageIndex >= existingGallery.imageUrls.length) {
      return NextResponse.json(
        { error: 'Invalid image index' },
        { status: 400 }
      );
    }

    // Update the thumbnail to the selected image
    const newThumbnail = existingGallery.imageUrls[imageIndex];
    
    const updatedGallery = await prisma.gallery.update({
      where: { id: galleryId },
      data: {
        thumbnail: newThumbnail
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

    return NextResponse.json({ 
      message: 'Thumbnail updated successfully',
      gallery: updatedGallery
    });
  } catch (error) {
    console.error('Error updating thumbnail:', error);
    return NextResponse.json(
      { error: 'Failed to update thumbnail' },
      { status: 500 }
    );
  }
}