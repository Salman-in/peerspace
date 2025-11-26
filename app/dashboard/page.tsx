'use client';

import { useState } from 'react';
import ChatSection from '@/components/dashboard/ChatSection';
import ChatAI from '@/components/dashboard/ChatAI';
import { Bot } from 'lucide-react';

export default function DashboardPage() {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Mobile AI button */}
      <button
        onClick={() => setAiOpen(!aiOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-[#d4a574] rounded-md text-[#1a1a1a]"
      >
        <Bot className="h-5 w-5" />
      </button>

      <div className="flex-1 overflow-hidden">
        <ChatSection />
      </div>
      
      {/* AI Panel - overlay on mobile, fixed on desktop */}
      <div className={`
        fixed lg:static inset-y-0 right-0 z-40 transform transition-transform duration-300 ease-in-out lg:transform-none
        ${aiOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <ChatAI />
      </div>

      {/* Overlay for mobile AI */}
      {aiOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setAiOpen(false)}
        />
      )}
    </div>
  );
}
