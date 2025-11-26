'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { Home, MessageSquare, Bot, History, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);

  return (
    <aside className="w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#2a2a2a]">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="p-2 bg-[#d4a574] rounded-md">
            <Bot className="h-5 w-5 text-[#1a1a1a]" />
          </div>
          <span className="text-xl font-medium text-[#e8e8e8]">
            PeerSpace
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {[
          { href: '/dashboard', icon: Home, label: 'Home' },
          { href: '/dashboard/my-posts', icon: MessageSquare, label: 'My Posts' },
          { href: '/dashboard/ai-history', icon: History, label: 'AI History' },
          { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
        ].map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center space-x-3 text-[#8e8e8e] hover:text-[#e8e8e8] hover:bg-[#2a2a2a] rounded-md p-3 transition"
          >
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-[#2a2a2a] relative" ref={popoverRef}>
        <button
          onClick={() => setShowPopover(!showPopover)}
          className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-[#2a2a2a] transition text-left"
        >
          <div className="w-8 h-8 bg-[#d4a574] rounded-full flex items-center justify-center text-[#1a1a1a] font-medium text-sm">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-[#e8e8e8] truncate">
              {user?.firstName || 'User'}
            </div>
            <div className="text-xs text-[#6e6e6e]">View account</div>
          </div>
        </button>

        {/* Popover */}
        {showPopover && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md shadow-lg p-2">
            <button
              onClick={() => {
                signOut();
                setShowPopover(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
