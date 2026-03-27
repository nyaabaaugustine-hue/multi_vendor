"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, MessageSquare, User, X, Send, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ListingCreateDialog } from '@/components/listing-create-dialog';
import { useAuth } from '@/components/providers';

// ── MOCK MESSAGES DATA ──────────────────────────────────────────────────────
const MOCK_MESSAGES = [
  {
    id: 'm1',
    avatar: 'M',
    name: 'Melcom Digital Hub',
    preview: 'Your MacBook Pro order has been dispatched. Tracking code: ACC-2026-88210',
    time: '2m ago',
    unread: true,
    thread: [
      { from: 'them', text: 'Hello! Your order is confirmed.', time: '10:00 AM' },
      { from: 'me', text: 'Great! When will it be dispatched?', time: '10:05 AM' },
      { from: 'them', text: 'Your MacBook Pro order has been dispatched. Tracking code: ACC-2026-88210', time: '10:30 AM' },
    ],
  },
  {
    id: 'm2',
    avatar: 'A',
    name: 'AutoTrust Motors',
    preview: 'The Land Cruiser is ready for pickup. Please bring your ID.',
    time: '1h ago',
    unread: true,
    thread: [
      { from: 'them', text: 'Good afternoon! Are you still interested in the Land Cruiser?', time: 'Yesterday' },
      { from: 'me', text: 'Yes, I would like to proceed.', time: 'Yesterday' },
      { from: 'them', text: 'The Land Cruiser is ready for pickup. Please bring your ID.', time: '1h ago' },
    ],
  },
  {
    id: 'm3',
    avatar: 'P',
    name: 'PrimeEstate GH',
    preview: 'We have a new property matching your preferences in East Legon.',
    time: '3h ago',
    unread: false,
    thread: [
      { from: 'them', text: 'We have a new property matching your preferences in East Legon.', time: '3h ago' },
    ],
  },
  {
    id: 'm4',
    avatar: 'H',
    name: 'Heritage Fashion',
    preview: 'Your custom Kente order is being woven. ETA: 5 days.',
    time: 'Yesterday',
    unread: false,
    thread: [
      { from: 'me', text: 'Hi, what is the ETA for my Kente order?', time: 'Yesterday' },
      { from: 'them', text: 'Your custom Kente order is being woven. ETA: 5 days.', time: 'Yesterday' },
    ],
  },
];

type Message = typeof MOCK_MESSAGES[number];

function MessagesPopup({ onClose }: { onClose: () => void }) {
  const [activeThread, setActiveThread] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const { user } = useAuth();

  const unreadCount = messages.filter(m => m.unread).length;

  const openThread = (msg: Message) => {
    setActiveThread(msg);
    // Mark as read
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, unread: false } : m));
  };

  const sendReply = () => {
    if (!replyText.trim() || !activeThread) return;
    const newMsg = { from: 'me' as const, text: replyText.trim(), time: 'Just now' };
    setMessages(prev => prev.map(m =>
      m.id === activeThread.id
        ? { ...m, thread: [...m.thread, newMsg], preview: newMsg.text, time: 'Just now' }
        : m
    ));
    setActiveThread(prev => prev ? { ...prev, thread: [...prev.thread, newMsg] } : prev);
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
          {activeThread ? (
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveThread(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <ChevronRight className="h-4 w-4 rotate-180" />
              </button>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-xs">
                {activeThread.avatar}
              </div>
              <span className="text-sm font-black uppercase tracking-tight text-foreground">{activeThread.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-black uppercase tracking-widest text-foreground">Messages</span>
              {unreadCount > 0 && (
                <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          )}
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Thread view */}
        {activeThread ? (
          <div className="flex flex-col h-[420px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeThread.thread.map((msg, i) => (
                <div key={i} className={cn("flex", msg.from === 'me' ? 'justify-end' : 'justify-start')}>
                  <div className={cn(
                    "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                    msg.from === 'me'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  )}>
                    <p>{msg.text}</p>
                    <p className={cn("text-[10px] mt-1", msg.from === 'me' ? 'text-primary-foreground/60' : 'text-muted-foreground')}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Reply box */}
            <div className="p-3 border-t border-border flex items-center gap-2">
              <input
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendReply()}
                placeholder="Type a message..."
                className="flex-1 h-10 px-4 bg-muted rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={sendReply}
                disabled={!replyText.trim()}
                className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-all hover:opacity-90 active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Conversation list */
          <div className="max-h-[420px] overflow-y-auto divide-y divide-border/50">
            {messages.length === 0 ? (
              <div className="py-16 text-center">
                <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">No messages yet</p>
              </div>
            ) : (
              messages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => openThread(msg)}
                  className="w-full flex items-start gap-4 px-5 py-4 hover:bg-muted/40 transition-colors text-left"
                >
                  <div className="relative shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-sm">
                      {msg.avatar}
                    </div>
                    {msg.unread && (
                      <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn("text-xs font-black uppercase tracking-tight", msg.unread ? 'text-foreground' : 'text-muted-foreground')}>{msg.name}</span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="text-[10px]">{msg.time}</span>
                      </div>
                    </div>
                    <p className={cn("text-xs truncate", msg.unread ? 'text-foreground font-medium' : 'text-muted-foreground')}>{msg.preview}</p>
                  </div>
                </button>
              ))
            )}
            {!user && (
              <div className="p-4 bg-muted/30 text-center">
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Login to see your messages</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── NAV ITEMS ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Search', icon: Search, href: '/listings' },
  { label: 'Sell', icon: PlusCircle, href: '/listings/create', isCenter: true },
  { label: 'Messages', icon: MessageSquare, href: null, isMessages: true },
  { label: 'Profile', icon: User, href: '/dashboard' },
];

export function FloatingNav() {
  const pathname = usePathname();
  const [showCreate, setShowCreate] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const MOCK_UNREAD = 2;

  return (
    <>
      {showMessages && <MessagesPopup onClose={() => setShowMessages(false)} />}

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-lg md:max-w-md">
        <nav className="bg-background/95 backdrop-blur-2xl border border-border shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl p-2 flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href ? pathname === item.href : false;
            const Icon = item.icon;

            if (item.isCenter) {
              return (
                <ListingCreateDialog key={item.label} open={showCreate} onOpenChange={setShowCreate}>
                  <button
                    onClick={() => setShowCreate(true)}
                    className="relative -top-6"
                    aria-label="Post a listing"
                  >
                    <div className="h-16 w-16 rounded-2xl bg-primary shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex items-center justify-center text-primary-foreground transition-transform hover:scale-110 active:scale-95 border-4 border-background">
                      <Icon className="h-8 w-8" />
                    </div>
                  </button>
                </ListingCreateDialog>
              );
            }

            if (item.isMessages) {
              return (
                <button
                  key={item.label}
                  onClick={() => setShowMessages(true)}
                  className={cn(
                    "relative flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-300",
                    showMessages ? "text-primary bg-primary/10" : "text-foreground/60 hover:text-primary"
                  )}
                  aria-label="Messages"
                >
                  <div className="relative">
                    <Icon className="h-5 w-5" />
                    {MOCK_UNREAD > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center">
                        {MOCK_UNREAD}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href!}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-300",
                  isActive ? "text-primary bg-primary/10" : "text-foreground/60 hover:text-primary"
                )}
              >
                <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
