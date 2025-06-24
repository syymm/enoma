import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { withAdminAuth } from '../../../../lib/middleware';
import { JWTPayload } from '../../../../lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

async function uploadHandler(request: NextRequest, adminPayload: JWTPayload) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const type = formData.get('type') as string; // 'gallery' or 'comic'
    const tags = formData.get('tags') as string;
    const color = formData.get('color') as string;
    const episode = formData.get('episode') as string;

    if (!files || files.length === 0 || !title || !price || !type) {
      return NextResponse.json(
        { error: 'At least one file, title, price, and type are required' },
        { status: 400 }
      );
    }

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type for ${file.name}. Only images are allowed.` },
          { status: 400 }
        );
      }
    }

    // Admin accounts have no file size limit

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Process and save all files
    const imageUrls: string[] = [];
    const timestamp = Date.now();
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Replace special chars with underscore
      const filename = `${timestamp}-${i}-${originalName}`;
      const filepath = path.join(uploadDir, filename);
      
      // Save file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);
      
      imageUrls.push(`/uploads/${filename}`);
    }
    
    // First image as thumbnail, all images in imageUrls array
    const thumbnail = imageUrls[0];
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    let result;
    
    if (type === 'gallery') {
      result = await prisma.gallery.create({
        data: {
          title,
          thumbnail,
          imageUrls,
          color: color || '#000000',
          price,
          description,
          tags: tagsArray,
          userId: adminPayload.userId,
        },
      });
    } else if (type === 'comic') {
      result = await prisma.comic.create({
        data: {
          title,
          thumbnail,
          imageUrls,
          color: color || '#000000',
          price,
          description,
          tags: tagsArray,
          episode: episode ? parseInt(episode) : null,
          userId: adminPayload.userId,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "gallery" or "comic"' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Upload successful',
      data: result,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withAdminAuth(uploadHandler);