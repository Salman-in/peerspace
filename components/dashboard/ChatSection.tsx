'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, Users } from 'lucide-react';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
}

const ChatSection = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        user: 'John Doe',
        content: 'Hello everyone! Anyone up for study group?',
        timestamp: new Date(),
      },
      {
        id: '2',
        user: 'Jane Smith',
        content: "I'm interested! What subject are you studying?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        user: 'You',
        content: message,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0f0f0f]">
      {/* Chat Header */}
      <div className="p-5 border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#2a2a2a] rounded-md">
              <Users className="h-5 w-5 text-[#d4a574]" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-[#e8e8e8]">General Chat</h2>
              <p className="text-xs text-[#8e8e8e]">Community Discussion</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#4ade80] rounded-full"></div>
            <span className="text-xs text-[#8e8e8e]">Active now</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="font-medium text-[#d4a574] text-sm">{msg.user}</span>
              <span className="text-xs text-[#6e6e6e]">
                {msg.timestamp.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
              </span>
            </div>
            <div className="bg-[#1a1a1a] rounded-md px-4 py-3 w-fit max-w-[80%] border border-[#2a2a2a]">
              <p className="text-[#e8e8e8] text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-[#2a2a2a]"
      >
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-4 py-3 pr-12 rounded-md border border-[#3a3a3a] bg-[#1a1a1a] text-[#e8e8e8] placeholder-[#6e6e6e] focus:outline-none focus:ring-1 focus:ring-[#d4a574] focus:border-[#d4a574] transition text-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#d4a574] text-[#1a1a1a] rounded-md hover:bg-[#c49564] focus:outline-none transition disabled:opacity-50"
            disabled={!message.trim()}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatSection;
