'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import ChatSection from '@/components/dashboard/ChatSection';
import ChatAI from '@/components/dashboard/ChatAI';
import { Menu, X, Bot } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-[#e8e8e8]"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile AI button */}
      <button
        onClick={() => setAiOpen(!aiOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-[#d4a574] rounded-md text-[#1a1a1a]"
      >
        <Bot className="h-5 w-5" />
      </button>

      {/* Sidebar - hidden on mobile, overlay on tablet, fixed on desktop */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar />
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
