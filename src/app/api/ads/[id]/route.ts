import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch single ad by slug or ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const excludeId = searchParams.get('exclude');

    // Try to find by slug first, then by id
    let ad = await db.ad.findFirst({
      where: {
        OR: [
          { slug: id },
          { id: id },
        ],
        status: { notIn: ['deleted'] },
      },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        category: {
          select: {
            id: true,
            nameEn: true,
            nameBn: true,
            slug: true,
          },
        },
        subCategory: {
          select: {
            id: true,
            nameEn: true,
            nameBn: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            companyName: true,
            phone: true,
            role: true,
            isVerified: true,
            accountType: true,
            createdAt: true,
            avatarUrl: true,
          },
        },
        attributes: true,
        _count: {
          select: {
            savedByUsers: true,
          },
        },
      },
    });

    if (!ad) {
      return NextResponse.json(
        { error: 'Ad not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await db.ad.update({
      where: { id: ad.id },
      data: { viewCount: { increment: 1 } },
    });

    // Get seller's active ads count
    const sellerAdsCount = await db.ad.count({
      where: {
        userId: ad.userId,
        status: 'active',
      },
    });

    return NextResponse.json({
      ad: {
        ...ad,
        sellerActiveAdsCount: sellerAdsCount,
      },
    });
  } catch (error) {
    console.error('Error fetching ad:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ad' },
      { status: 500 }
    );
  }
}

// PATCH - Update ad status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['active', 'sold', 'expired', 'pending_review'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Find the ad
    const existingAd = await db.ad.findFirst({
      where: {
        OR: [
          { slug: id },
          { id: id },
        ],
      },
    });

    if (!existingAd) {
      return NextResponse.json(
        { error: 'Ad not found' },
        { status: 404 }
      );
    }

    // Update the ad
    const updatedAd = await db.ad.update({
      where: { id: existingAd.id },
      data: { status },
    });

    return NextResponse.json({ ad: updatedAd });
  } catch (error) {
    console.error('Error updating ad:', error);
    return NextResponse.json(
      { error: 'Failed to update ad' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an ad
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Find the ad
    const existingAd = await db.ad.findFirst({
      where: {
        OR: [
          { slug: id },
          { id: id },
        ],
      },
    });

    if (!existingAd) {
      return NextResponse.json(
        { error: 'Ad not found' },
        { status: 404 }
      );
    }

    // Soft delete by updating status
    await db.ad.update({
      where: { id: existingAd.id },
      data: { status: 'deleted' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ad:', error);
    return NextResponse.json(
      { error: 'Failed to delete ad' },
      { status: 500 }
    );
  }
}
