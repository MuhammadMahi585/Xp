import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file received' }, 
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file
    const buffer = await file.arrayBuffer();
    const filename = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, filename);
    
    await fs.promises.writeFile(filePath, Buffer.from(buffer));

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}