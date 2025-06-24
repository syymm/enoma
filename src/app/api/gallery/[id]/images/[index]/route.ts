import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { verifyJWT } from '../../../../../../lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; index: string }> }
) {
  try {
    const payload = await verifyJWT(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const galleryId = parseInt(resolvedParams.id);
    const imageIndex = parseInt(resolvedParams.index);
    
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

    // Remove the image from the array
    const updatedImageUrls = existingGallery.imageUrls.filter((_, index) => index !== imageIndex);

    // If this was the last image, we can't delete it
    if (updatedImageUrls.length === 0) {
      return NextResponse.json(
        { error: 'Cannot delete the last image. Gallery must have at least one image.' },
        { status: 400 }
      );
    }

    // Update the gallery with the new image array
    const updatedGallery = await prisma.gallery.update({
      where: { id: galleryId },
      data: {
        imageUrls: updatedImageUrls,
        // If we deleted the first image, update the thumbnail
        ...(imageIndex === 0 && { thumbnail: updatedImageUrls[0] })
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
      message: 'Image deleted successfully',
      gallery: updatedGallery
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}