'use client';

import { useState, useEffect } from 'react';
import { Bot, User, Clock, Trash2 } from 'lucide-react';

interface Conversation {
  _id?: string;
  id: string;
  userId: string;
  question: string;
  answer: string;
  timestamp: string;
}

export default function AIHistoryPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const clearHistory = async () => {
    if (confirm('Are you sure you want to clear all AI conversation history?')) {
      try {
        const response = await fetch('/api/conversations', { method: 'DELETE' });
        if (response.ok) {
          setConversations([]);
        }
      } catch (error) {
        console.error('Failed to clear conversations:', error);
      }
    }
  };

  return (
    <div className="flex-1 h-screen bg-[#0f0f0f] overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#e8e8e8]">AI History</h1>
            <p className="text-sm text-[#8e8e8e] mt-1">
              Your conversation history with PeerAI ({conversations.length} conversations)
            </p>
          </div>
          {conversations.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-3 py-2 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20 transition text-sm font-medium flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-12 bg-[#1a1a1a] rounded-md border border-[#2a2a2a]">
            <Bot className="h-12 w-12 text-[#8e8e8e] mx-auto mb-3" />
            <p className="text-[#8e8e8e] text-sm">No conversation history yet.</p>
            <p className="text-[#6e6e6e] text-xs mt-1">Start chatting with PeerAI to see your history here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => (
              <div key={conv.id} className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] p-4">
                <div className="flex items-center space-x-2 text-xs text-[#6e6e6e] mb-3">
                  <Clock className="h-3 w-3" />
                  <span>
                    {new Date(conv.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </span>
                </div>

                {/* Question */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-[#8e8e8e]" />
                    <span className="text-xs font-medium text-[#8e8e8e]">You</span>
                  </div>
                  <p className="text-sm text-[#e8e8e8] pl-6">{conv.question}</p>
                </div>

                {/* Answer */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="h-4 w-4 text-[#d4a574]" />
                    <span className="text-xs font-medium text-[#d4a574]">PeerAI</span>
                  </div>
                  <p className="text-sm text-[#e8e8e8] pl-6 whitespace-pre-wrap">{conv.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
