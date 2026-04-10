import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST - Create a new report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adId, reason, description } = body;

    // Validate required fields
    if (!adId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if ad exists
    const ad = await db.ad.findUnique({
      where: { id: adId },
    });

    if (!ad) {
      return NextResponse.json(
        { error: 'Ad not found' },
        { status: 404 }
      );
    }

    // Get reporter from session/auth header (simplified for now)
    // In production, you'd get this from the session
    const authHeader = request.headers.get('authorization');
    const reporterId = body.reporterId; // Should come from auth

    if (!reporterId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create the report
    const report = await db.report.create({
      data: {
        reporterId,
        adId,
        reason,
        description: description || null,
        status: 'open',
      },
    });

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}

// GET - Get reports (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const reports = await db.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        ad: {
          select: {
            id: true,
            title: true,
            adReferenceId: true,
          },
        },
        reporter: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    const total = await db.report.count({ where });

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
