import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createUddoktaPayPayment } from '@/lib/uddoktapay';
import { getBoostPackageById, getActivePaymentGateway } from '@/lib/payment-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adId, packageId, userId, userEmail, userName } = body;

    // Validate input
    if (!adId || !packageId || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if payment gateway is active
    const gateway = getActivePaymentGateway();
    if (!gateway || !gateway.isActive) {
      return NextResponse.json(
        { error: 'Payment gateway is not available' },
        { status: 503 }
      );
    }

    // Get boost package details
    const boostPackage = getBoostPackageById(packageId);
    if (!boostPackage) {
      return NextResponse.json(
        { error: 'Invalid boost package' },
        { status: 400 }
      );
    }

    // Verify the ad belongs to the user
    const ad = await db.ad.findFirst({
      where: { id: adId, userId },
    });

    if (!ad) {
      return NextResponse.json(
        { error: 'Ad not found or access denied' },
        { status: 404 }
      );
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        userId,
        amount: boostPackage.price,
        currency: 'BDT',
        paymentMethod: 'uddoktapay',
        paymentGateway: 'uddoktapay',
        status: 'pending',
        metadata: JSON.stringify({
          adId,
          packageId,
          boostType: boostPackage.type,
          durationDays: boostPackage.durationDays,
        }),
      },
    });

    // Create UddoktaPay payment request
    const paymentResponse = await createUddoktaPayPayment({
      fullName: userName || 'Customer',
      email: userEmail,
      amount: boostPackage.price,
      metadata: {
        payment_id: payment.id,
        ad_id: adId,
        user_id: userId,
        package_id: packageId,
        boost_type: boostPackage.type,
        duration_days: boostPackage.durationDays.toString(),
      },
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?payment=callback`,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?payment=success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?payment=cancel`,
    });

    if (!paymentResponse.status || !paymentResponse.data) {
      // Update payment status to failed
      await db.payment.update({
        where: { id: payment.id },
        data: { status: 'failed' },
      });

      return NextResponse.json(
        { error: paymentResponse.message || 'Failed to create payment' },
        { status: 400 }
      );
    }

    // Update payment with reference ID
    await db.payment.update({
      where: { id: payment.id },
      data: { referenceId: paymentResponse.data.invoice_id },
    });

    return NextResponse.json({
      success: true,
      paymentUrl: paymentResponse.data.payment_url,
      invoiceId: paymentResponse.data.invoice_id,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error('Create boost payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
