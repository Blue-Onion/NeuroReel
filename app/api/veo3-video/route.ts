import { NextRequest, NextResponse } from 'next/server';
import { generateVeo3Video } from '@/actions/create';

export async function POST(req: NextRequest) {
  try {
    const { scene, starImageUrl, durationSeconds, style } = await req.json();
    if (!scene) {
      return NextResponse.json({ error: 'scene is required' }, { status: 400 });
    }
    const result = await generateVeo3Video({ scene, starImageUrl, durationSeconds, style });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
