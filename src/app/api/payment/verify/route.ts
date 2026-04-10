import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyUddoktaPayPayment } from '@/lib/uddoktapay';
import { getBoostPackageById } from '@/lib/payment-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId } = body;

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // Verify payment with UddoktaPay
    const verifyResponse = await verifyUddoktaPayPayment(invoiceId);

    if (!verifyResponse.status || !verifyResponse.data) {
      return NextResponse.json(
        { error: verifyResponse.message || 'Payment verification failed' },
        { status: 400 }
      );
    }

    const paymentData = verifyResponse.data;

    // Find the payment record
    const payment = await db.payment.findFirst({
      where: { referenceId: invoiceId },
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
        paymentId: payment.id,
      });
    }

    // Update payment status
    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: 'completed',
        paymentMethod: paymentData.payment_method,
      },
    });

    // Get boost details from metadata
    const metadata = typeof payment.metadata === 'string' 
      ? JSON.parse(payment.metadata) 
      : payment.metadata;

    const { adId, packageId, boostType, durationDays } = metadata;
    const boostPackage = getBoostPackageById(packageId);

    if (boostPackage && adId) {
      // Calculate boost dates
      const startsAt = new Date();
      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + durationDays);

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
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and boost activated',
      paymentId: payment.id,
      transactionId: paymentData.transaction_id,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for redirect callback
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const invoiceId = searchParams.get('invoice_id');
  const status = searchParams.get('status');

  if (!invoiceId) {
    return NextResponse.redirect(new URL('/?payment=error&message=Invalid invoice', request.url));
  }

  // Verify payment with UddoktaPay
  const verifyResponse = await verifyUddoktaPayPayment(invoiceId);

  if (!verifyResponse.status || !verifyResponse.data) {
    return NextResponse.redirect(new URL('/?payment=error&message=Payment verification failed', request.url));
  }

  const paymentData = verifyResponse.data;

  // Find the payment record
  const payment = await db.payment.findFirst({
    where: { referenceId: invoiceId },
  });

  if (!payment) {
    return NextResponse.redirect(new URL('/?payment=error&message=Payment not found', request.url));
  }

  // If payment is already completed, redirect to success
  if (payment.status === 'completed') {
    return NextResponse.redirect(new URL('/?payment=success', request.url));
  }

  // Update payment status
  await db.payment.update({
    where: { id: payment.id },
    data: {
      status: 'completed',
      paymentMethod: paymentData.payment_method,
    },
  });

  // Get boost details from metadata
  const metadata = typeof payment.metadata === 'string' 
    ? JSON.parse(payment.metadata) 
    : payment.metadata;

  const { adId, boostType, durationDays } = metadata;
  const boostPackage = getBoostPackageById(metadata.packageId);

  if (boostPackage && adId) {
    // Calculate boost dates
    const startsAt = new Date();
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + durationDays);

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
  }

  return NextResponse.redirect(new URL('/?payment=success', request.url));
}
