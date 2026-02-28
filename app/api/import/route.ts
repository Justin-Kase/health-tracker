import { NextRequest, NextResponse } from 'next/server';
import { parseHealthData } from '@/lib/parseHealthData';
import { saveHealthData } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();
    const data = await parseHealthData(text);
    const syncId = saveHealthData(data);

    return NextResponse.json({ 
      success: true, 
      syncId,
      message: 'Health data imported successfully'
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to import data' 
    }, { status: 500 });
  }
}
