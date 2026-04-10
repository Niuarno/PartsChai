import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getBoostPackageById } from '@/lib/payment-config';

// UddoktaPay Webhook Handler
// This endpoint receives webhook notifications from UddoktaPay

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract webhook data
    const {
      invoice_id,
      transaction_id,
      payment_method,
      amount,
      fee,
      status,
      metadata,
      created_at,
      paid_at,
    } = body;

    // Validate required fields
    if (!invoice_id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the payment record
    const payment = await db.payment.findFirst({
      where: { referenceId: invoice_id },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // If payment is already completed, return success
    if (payment.status === 'completed') {
      return NextResponse.json({
        success: true,
        message: 'Payment already processed',
      });
    }

    // Only process successful payments
    if (status !== 'completed' && status !== 'paid') {
      // Update payment status to failed if not successful
      await db.payment.update({
        where: { id: payment.id },
        data: { status: 'failed' },
      });

      return NextResponse.json({
        success: true,
        message: 'Payment not successful',
      });
    }

    // Update payment status
    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: 'completed',
        paymentMethod: payment_method,
        metadata: JSON.stringify({
          ...(typeof payment.metadata === 'string' ? JSON.parse(payment.metadata) : payment.metadata),
          transactionId: transaction_id,
          fee,
          paidAt: paid_at,
        }),
      },
    });

    // Get boost details from metadata
    const paymentMetadata = typeof payment.metadata === 'string' 
      ? JSON.parse(payment.metadata) 
      : payment.metadata;

    const { adId, boostType, durationDays, packageId } = paymentMetadata;
    const boostPackage = getBoostPackageById(packageId);

    if (boostPackage && adId) {
      // Calculate boost dates
      const startsAt = new Date();
      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + durationDays);

      // Check if boost already exists for this payment
      const existingBoost = await db.adBoost.findFirst({
        where: { paymentId: payment.id },
      });

      if (!existingBoost) {
        // Create ad boost record
        await db.adBoost.create({
          data: {
            adId,
            userId: payment.userId,
            boostType,
            startsAt,
            endsAt,
            isActive: true,
            costPaid: payment.amount,
            paymentId: payment.id,
          },
        });

        // Update ad flags based on boost type
        const updateData: Record<string, boolean> = {};
        if (boostType === 'top_ad') {
          updateData.isTopAd = true;
        } else if (boostType === 'urgent') {
          updateData.isUrgent = true;
        } else if (boostType === 'featured') {
          updateData.isFeatured = true;
        }

        if (Object.keys(updateData).length > 0) {
          await db.ad.update({
            where: { id: adId },
            data: updateData,
          });
        }

        // For bump_up, update the publishedAt date
        if (boostType === 'bump_up') {
          await db.ad.update({
            where: { id: adId },
            data: { publishedAt: new Date() },
          });
        }

        // Create notification for user
        await db.notification.create({
          data: {
            userId: payment.userId,
            type: 'boost_activated',
            title: 'Boost Activated',
            body: `Your ${boostPackage.name} boost has been activated for your ad.`,
            link: `/?dashboard=true`,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check for webhook endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'UddoktaPay webhook endpoint is active',
  });
}
