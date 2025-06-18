import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { withAdminAuth } from '../../../../lib/middleware';
import { JWTPayload } from '../../../../lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

async function uploadHandler(request: NextRequest, adminPayload: JWTPayload) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const type = formData.get('type') as string; // 'gallery' or 'comic'
    const tags = formData.get('tags') as string;
    const color = formData.get('color') as string;
    const episode = formData.get('episode') as string;

    if (!file || !title || !price || !type) {
      return NextResponse.json(
        { error: 'File, title, price, and type are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = path.join(uploadDir, filename);
    
    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);
    
    // Save to database
    const imageUrl = `/uploads/${filename}`;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    let result;
    
    if (type === 'gallery') {
      result = await prisma.gallery.create({
        data: {
          title,
          thumbnail: imageUrl,
          imageUrl,
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
          thumbnail: imageUrl,
          imageUrl,
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