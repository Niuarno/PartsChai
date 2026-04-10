import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Get all conversations for a user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get conversations where user is either buyer or seller
    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId },
        ],
      },
      include: {
        ad: {
          select: {
            id: true,
            title: true,
            price: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        buyer: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        seller: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    // Transform data for frontend
    const transformedConversations = conversations.map((conv) => {
      const isBuyer = conv.buyerId === userId;
      const otherUser = isBuyer ? conv.seller : conv.buyer;
      const unreadCount = 0; // TODO: Calculate unread messages

      return {
        id: conv.id,
        adId: conv.adId,
        adTitle: conv.ad.title,
        adImage: conv.ad.images[0]?.imageUrl,
        adPrice: conv.ad.price,
        buyerId: conv.buyerId,
        sellerId: conv.sellerId,
        otherUser: {
          id: otherUser.id,
          name: otherUser.fullName || 'Unknown',
          avatar: otherUser.avatarUrl,
        },
        lastMessage: conv.messages[0] ? {
          id: conv.messages[0].id,
          conversationId: conv.messages[0].conversationId,
          senderId: conv.messages[0].senderId,
          content: conv.messages[0].content,
          createdAt: conv.messages[0].createdAt.toISOString(),
          isRead: conv.messages[0].isRead,
        } : undefined,
        unreadCount,
      };
    });

    return NextResponse.json({ conversations: transformedConversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { adId } = body;

    if (!adId) {
      return NextResponse.json({ error: 'Ad ID is required' }, { status: 400 });
    }

    // Get the ad to find the seller
    const ad = await db.ad.findUnique({
      where: { id: adId },
      select: { userId: true },
    });

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Check if conversation already exists
    const existingConversation = await db.conversation.findFirst({
      where: {
        adId,
        buyerId: userId,
        sellerId: ad.userId,
      },
    });

    if (existingConversation) {
      return NextResponse.json({ conversation: existingConversation });
    }

    // Create new conversation
    const conversation = await db.conversation.create({
      data: {
        adId,
        buyerId: userId,
        sellerId: ad.userId,
      },
    });

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
