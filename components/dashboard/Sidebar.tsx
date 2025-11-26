'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Home, MessageSquare, Bot, History, Settings } from 'lucide-react';

const Sidebar = () => {
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
      <div className="p-4 border-t border-[#2a2a2a]">
        <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-[#2a2a2a] transition">
          <UserButton afterSignOutUrl="/" />
          <div className="flex-1">
            <div className="text-sm font-medium text-[#e8e8e8]">My Account</div>
            <div className="text-xs text-[#6e6e6e]">Manage profile</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
