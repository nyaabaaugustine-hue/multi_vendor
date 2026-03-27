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
    id: 'm1', avatar: 'M', name: 'Melcom Digital Hub',
    preview: 'Your MacBook Pro order has been dispatched. Tracking: ACC-2026-88210',
    time: '2m ago', unread: true,
    thread: [
      { from: 'them', text: 'Hello! Your order is confirmed.', time: '10:00 AM' },
      { from: 'me',   text: 'Great! When will it be dispatched?', time: '10:05 AM' },
      { from: 'them', text: 'Your MacBook Pro order has been dispatched. Tracking: ACC-2026-88210', time: '10:30 AM' },
    ],
  },
  {
    id: 'm2', avatar: 'A', name: 'AutoTrust Motors',
    preview: 'The Land Cruiser is ready for pickup. Please bring your ID.',
    time: '1h ago', unread: true,
    thread: [
      { from: 'them', text: 'Are you still interested in the Land Cruiser?', time: 'Yesterday' },
      { from: 'me',   text: 'Yes, I would like to proceed.', time: 'Yesterday' },
      { from: 'them', text: 'The Land Cruiser is ready for pickup. Please bring your ID.', time: '1h ago' },
    ],
  },
  {
    id: 'm3', avatar: 'P', name: 'PrimeEstate GH',
    preview: 'We have a new property matching your preferences in East Legon.',
    time: '3h ago', unread: false,
    thread: [
      { from: 'them', text: 'We have a new property matching your preferences in East Legon.', time: '3h ago' },
    ],
  },
  {
    id: 'm4', avatar: 'H', name: 'Heritage Fashion',
    preview: 'Your custom Kente order is being woven. ETA: 5 days.',
    time: 'Yesterday', unread: false,
    thread: [
      { from: 'me',   text: 'Hi, what is the ETA for my Kente order?', time: 'Yesterday' },
      { from: 'them', text: 'Your custom Kente order is being woven. ETA: 5 days.', time: 'Yesterday' },
    ],
  },
];

type Message = typeof MOCK_MESSAGES[number];

function MessagesPopup({ onClose }: { onClose: () => void }) {
  const [activeThread, setActiveThread] = useState<Message | null>(null);
  const [replyText, setReplyText]       = useState('');
  const [messages, setMessages]         = useState(MOCK_MESSAGES);
  const { user } = useAuth();

  const unreadCount = messages.filter(m => m.unread).length;

  const openThread = (msg: Message) => {
    setActiveThread(msg);
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
    <div
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
        style={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))' }}
        >
          {activeThread ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveThread(null)}
                style={{ color: 'hsl(var(--muted-foreground))' }}
                className="hover:opacity-70 transition-opacity"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
              </button>
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center font-black text-xs"
                style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
              >
                {activeThread.avatar}
              </div>
              <span className="text-sm font-black uppercase tracking-tight" style={{ color: 'hsl(var(--foreground))' }}>
                {activeThread.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <MessageSquare className="h-4 w-4" style={{ color: 'hsl(var(--primary))' }} />
              <span className="text-sm font-black uppercase tracking-widest" style={{ color: 'hsl(var(--foreground))' }}>
                Messages
              </span>
              {unreadCount > 0 && (
                <span
                  className="h-5 w-5 rounded-full text-[9px] font-black flex items-center justify-center"
                  style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Thread view */}
        {activeThread ? (
          <div className="flex flex-col h-[420px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {activeThread.thread.map((msg, i) => (
                <div key={i} className={cn("flex", msg.from === 'me' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn("max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed")}
                    style={msg.from === 'me'
                      ? { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', borderBottomRightRadius: '4px' }
                      : { backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', borderBottomLeftRadius: '4px' }
                    }
                  >
                    <p>{msg.text}</p>
                    <p className="text-[10px] mt-1 opacity-60">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Reply box */}
            <div className="p-3 border-t flex items-center gap-2" style={{ borderColor: 'hsl(var(--border))' }}>
              <input
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendReply()}
                placeholder="Type a message..."
                className="flex-1 h-10 px-4 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'hsl(var(--muted))',
                  color: 'hsl(var(--foreground))',
                  border: '2px solid hsl(var(--border))',
                }}
              />
              <button
                onClick={sendReply}
                disabled={!replyText.trim()}
                className="h-10 w-10 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Conversation list */
          <div className="max-h-[420px] overflow-y-auto no-scrollbar">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => openThread(msg)}
                className="w-full flex items-start gap-4 px-5 py-4 border-b text-left transition-colors hover:bg-black/3"
                style={{ borderColor: 'hsl(var(--border) / 0.5)' }}
              >
                <div className="relative shrink-0">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center font-black text-sm border"
                    style={{
                      backgroundColor: 'hsl(var(--primary) / 0.1)',
                      color: 'hsl(var(--primary))',
                      borderColor: 'hsl(var(--primary) / 0.2)',
                    }}
                  >
                    {msg.avatar}
                  </div>
                  {msg.unread && (
                    <span
                      className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2"
                      style={{
                        backgroundColor: 'hsl(var(--primary))',
                        borderColor: 'hsl(var(--background))',
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-xs font-black uppercase tracking-tight"
                      style={{ color: msg.unread ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
                    >
                      {msg.name}
                    </span>
                    <div className="flex items-center gap-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      <Clock className="h-3 w-3" />
                      <span className="text-[10px]">{msg.time}</span>
                    </div>
                  </div>
                  <p
                    className={cn("text-xs truncate", msg.unread ? "font-semibold" : "font-normal")}
                    style={{ color: msg.unread ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
                  >
                    {msg.preview}
                  </p>
                </div>
              </button>
            ))}
            {!user && (
              <div
                className="p-4 text-center"
                style={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}
              >
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  Login to see your messages
                </p>
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
  { label: 'Home',     icon: Home,         href: '/',         isCenter: false, isMessages: false },
  { label: 'Search',   icon: Search,       href: '/listings', isCenter: false, isMessages: false },
  { label: 'Sell',     icon: PlusCircle,   href: null,        isCenter: true,  isMessages: false },
  { label: 'Messages', icon: MessageSquare,href: null,        isCenter: false, isMessages: true  },
  { label: 'Profile',  icon: User,         href: '/dashboard',isCenter: false, isMessages: false },
];

export function FloatingNav() {
  const pathname        = usePathname();
  const [showCreate, setShowCreate]   = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const MOCK_UNREAD = 2;

  return (
    <>
      {showMessages && <MessagesPopup onClose={() => setShowMessages(false)} />}

      {/* Bottom floating nav bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-[420px]">
        <nav
          className="backdrop-blur-2xl border shadow-[0_20px_60px_rgba(0,0,0,0.18)] rounded-3xl px-2 py-2.5 flex items-center justify-around"
          style={{
            backgroundColor: 'hsl(var(--background) / 0.97)',
            borderColor: 'hsl(var(--border))',
            boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px hsl(var(--border))',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.href ? pathname === item.href : false;
            const Icon     = item.icon;

            /* ── Centre post button ── */
            if (item.isCenter) {
              return (
                <ListingCreateDialog key={item.label} open={showCreate} onOpenChange={setShowCreate}>
                  <button
                    aria-label="Post a listing"
                    className="relative -top-7 transition-transform hover:scale-110 active:scale-95"
                  >
                    <div
                      className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-xl border-4"
                      style={{
                        backgroundColor: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))',
                        borderColor: 'hsl(var(--background))',
                        boxShadow: '0 10px 30px hsl(var(--primary) / 0.4)',
                      }}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                  </button>
                </ListingCreateDialog>
              );
            }

            /* ── Messages button ── */
            if (item.isMessages) {
              return (
                <button
                  key={item.label}
                  onClick={() => setShowMessages(true)}
                  className="relative flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-200"
                  style={{ color: showMessages ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}
                  aria-label="Messages"
                >
                  {showMessages && (
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
                    />
                  )}
                  <div className="relative z-10">
                    <Icon className="h-5 w-5" />
                    {MOCK_UNREAD > 0 && (
                      <span
                        className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full text-[9px] font-black flex items-center justify-center"
                        style={{
                          backgroundColor: 'hsl(var(--primary))',
                          color: 'hsl(var(--primary-foreground))',
                        }}
                      >
                        {MOCK_UNREAD}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest relative z-10">{item.label}</span>
                </button>
              );
            }

            /* ── Regular nav links ── */
            return (
              <Link
                key={item.label}
                href={item.href!}
                className="relative flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-200"
                style={{ color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}
              >
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
                  />
                )}
                <Icon className={cn("h-5 w-5 relative z-10 transition-transform", isActive && "scale-110")} />
                <span className="text-[9px] font-black uppercase tracking-widest relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
