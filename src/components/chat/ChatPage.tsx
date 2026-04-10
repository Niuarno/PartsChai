'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Send,
  Phone,
  MoreVertical,
  Check,
  CheckCheck,
  User,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore, useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  adId: string;
  adTitle: string;
  adImage?: string;
  adPrice: number;
  buyerId: string;
  sellerId: string;
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
  };
  lastMessage?: Message;
  unreadCount: number;
}

// Mock data for demo
const mockConversations: Conversation[] = [
  {
    id: '1',
    adId: 'ad-1',
    adTitle: 'AMD Ryzen 7 7800X3D Gaming Processor',
    adImage: '/images/placeholder-1.jpg',
    adPrice: 52000,
    buyerId: 'user-2',
    sellerId: 'demo-user',
    otherUser: {
      id: 'user-2',
      name: 'Rahman Ahmed',
      isOnline: true,
    },
    lastMessage: {
      id: 'm1',
      conversationId: '1',
      senderId: 'user-2',
      content: 'Is this still available? What is the condition?',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      isRead: false,
    },
    unreadCount: 2,
  },
  {
    id: '2',
    adId: 'ad-2',
    adTitle: 'NVIDIA RTX 4070 Super 12GB GDDR6X',
    adImage: '/images/placeholder-2.jpg',
    adPrice: 75000,
    buyerId: 'demo-user',
    sellerId: 'user-3',
    otherUser: {
      id: 'user-3',
      name: 'Karim Hossain',
      isOnline: false,
    },
    lastMessage: {
      id: 'm2',
      conversationId: '2',
      senderId: 'demo-user',
      content: 'Thanks for the info! I will think about it.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      isRead: true,
    },
    unreadCount: 0,
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1-1',
      conversationId: '1',
      senderId: 'user-2',
      content: 'Hi, I saw your ad for the Ryzen 7 7800X3D',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      isRead: true,
    },
    {
      id: 'm1-2',
      conversationId: '1',
      senderId: 'demo-user',
      content: 'Hello! Yes, it\'s still available. Used for only 2 months.',
      createdAt: new Date(Date.now() - 7100000).toISOString(),
      isRead: true,
    },
    {
      id: 'm1-3',
      conversationId: '1',
      senderId: 'user-2',
      content: 'Great! Is this still available? What is the condition?',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      isRead: false,
    },
  ],
  '2': [
    {
      id: 'm2-1',
      conversationId: '2',
      senderId: 'demo-user',
      content: 'Hello, I\'m interested in the RTX 4070 Super',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      isRead: true,
    },
    {
      id: 'm2-2',
      conversationId: '2',
      senderId: 'user-3',
      content: 'Hi! It\'s brand new, sealed in box. Full warranty available.',
      createdAt: new Date(Date.now() - 172700000).toISOString(),
      isRead: true,
    },
    {
      id: 'm2-3',
      conversationId: '2',
      senderId: 'demo-user',
      content: 'Thanks for the info! I will think about it.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      isRead: true,
    },
  ],
};

export default function ChatPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { language } = useLanguageStore();
  const t = translations[language];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Load messages when conversation selected
  useEffect(() => {
    if (selectedConversation) {
      const convMessages = mockMessages[selectedConversation.id] || [];
      // Using flushSync would be better but for now we'll defer the state update
      const timer = setTimeout(() => {
        setMessages(convMessages);
        scrollToBottom();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [selectedConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: user.id,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
    scrollToBottom();

    // Simulate response after 2 seconds
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const autoReply: Message = {
          id: `m-${Date.now()}-reply`,
          conversationId: selectedConversation.id,
          senderId: selectedConversation.otherUser.id,
          content: language === 'bn' 
            ? 'ধন্যবাদ! আমি শীঘ্রই আপনার সাথে যোগাযোগ করব।' 
            : 'Thanks for your message! I\'ll get back to you soon.',
          createdAt: new Date().toISOString(),
          isRead: false,
        };
        setMessages((prev) => [...prev, autoReply]);
        scrollToBottom();
      }, 2000);
    }, 1000);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return t.justNow;
    if (diffMins < 60) return `${diffMins} ${t.minutesAgo}`;
    if (diffHours < 24) return `${diffHours} ${t.hoursAgo}`;
    if (diffDays < 7) return `${diffDays} ${t.daysAgo}`;
    
    return date.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // If not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              {language === 'bn' ? 'লগইন করুন' : 'Login Required'}
            </h2>
            <p className="text-slate-500 mb-6">
              {language === 'bn'
                ? 'মেসেজ পাঠাতে বা দেখতে লগইন করুন'
                : 'Please login to view and send messages'}
            </p>
            <Link href="/">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                {t.login}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Conversation List */}
      <div
        className={cn(
          'w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col',
          selectedConversation && 'hidden md:flex'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-2 md:hidden">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <h1 className="text-xl font-bold text-slate-800">{t.messages}</h1>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <User className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>{t.noMessages}</p>
              <p className="text-sm mt-2">{t.startConversation}</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={cn(
                  'w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100',
                  selectedConversation?.id === conv.id && 'bg-emerald-50'
                )}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      {conv.otherUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {conv.otherUser.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-800 truncate">
                      {conv.otherUser.name}
                    </span>
                    {conv.lastMessage && (
                      <span className="text-xs text-slate-400">
                        {formatTime(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-emerald-600 truncate">
                    {conv.adTitle}
                  </p>
                  {conv.lastMessage && (
                    <p className="text-sm text-slate-500 truncate mt-1">
                      {conv.lastMessage.content}
                    </p>
                  )}
                </div>
                {conv.unreadCount > 0 && (
                  <Badge className="bg-emerald-500 text-white shrink-0">
                    {conv.unreadCount}
                  </Badge>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={cn(
          'flex-1 flex flex-col bg-slate-50',
          !selectedConversation && 'hidden md:flex'
        )}
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-slate-200 p-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSelectedConversation(null)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-emerald-100 text-emerald-700">
                  {selectedConversation.otherUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800">
                  {selectedConversation.otherUser.name}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedConversation.otherUser.isOnline ? (
                    <span className="text-emerald-600">Online</span>
                  ) : (
                    'Offline'
                  )}
                </p>
              </div>
              <Link href={`/?ad=${selectedConversation.adId}`}>
                <Button variant="outline" size="sm" className="shrink-0">
                  {language === 'bn' ? 'বিজ্ঞাপন দেখুন' : 'View Ad'}
                </Button>
              </Link>
            </div>

            {/* Ad Info Bar */}
            <div className="bg-emerald-50 border-b border-emerald-100 p-3">
              <Link
                href={`/?ad=${selectedConversation.adId}`}
                className="flex items-center gap-3 hover:bg-emerald-100 rounded-lg p-2 -m-2 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-emerald-200 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {selectedConversation.adTitle}
                  </p>
                  <p className="text-sm text-emerald-600 font-medium">
                    ৳ {selectedConversation.adPrice.toLocaleString()}
                  </p>
                </div>
              </Link>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-slate-500 py-8">
                  <p>{t.startConversation}</p>
                </div>
              )}
              {messages.map((message) => {
                const isOwn = message.senderId === user?.id;
                return (
                  <div
                    key={message.id}
                    className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] px-4 py-2 rounded-2xl',
                        isOwn
                          ? 'bg-emerald-500 text-white rounded-br-md'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div
                        className={cn(
                          'flex items-center justify-end gap-1 mt-1',
                          isOwn ? 'text-emerald-100' : 'text-slate-400'
                        )}
                      >
                        <span className="text-xs">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {isOwn && (
                          message.isRead ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' } as React.CSSProperties} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' } as React.CSSProperties} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-slate-200 p-4">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t.typeMessage}
                  className="flex-1 bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!newMessage.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 shrink-0"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-500">
              <User className="h-16 w-16 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium text-slate-700">
                {language === 'bn' ? 'কথোপকথন নির্বাচন করুন' : 'Select a conversation'}
              </p>
              <p className="text-sm mt-1">
                {language === 'bn'
                  ? 'বাম থেকে একটি কথোপকথন বেছে নিন'
                  : 'Choose a conversation from the left to start messaging'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
