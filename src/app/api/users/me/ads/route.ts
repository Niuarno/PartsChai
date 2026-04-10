import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ads = await db.ad.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        category: {
          select: { nameEn: true, nameBn: true, slug: true },
        },
        subCategory: {
          select: { nameEn: true, nameBn: true, slug: true },
        },
      },
    });

    return NextResponse.json({ ads });
  } catch (error) {
    console.error('Error fetching user ads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ads' },
      { status: 500 }
    );
  }
}
