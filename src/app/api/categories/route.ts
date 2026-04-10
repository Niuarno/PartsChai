import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const withCounts = searchParams.get('withCounts') === 'true';

    const categories = await db.category.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
        _count: withCounts
          ? {
              select: {
                ads: {
                  where: { status: 'active' },
                },
              },
            }
          : false,
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
