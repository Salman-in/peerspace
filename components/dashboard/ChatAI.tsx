"use client"
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowUp, Bot, User } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatAI = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleQuery() {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    
    try {
      const res = await fetch("/api/rag", {
        method: "POST",
        body: JSON.stringify({ query: userMessage }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Failed to get response" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-96 bg-[#1a1a1a] border-l border-[#2a2a2a] flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-[#2a2a2a]">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#2a2a2a] rounded-md">
            <Bot className="h-5 w-5 text-[#d4a574]" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-[#e8e8e8]">PeerAI</h2>
            <p className="text-xs text-[#8e8e8e]">Your AI Assistant</p>
          </div>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-flex p-3 bg-[#2a2a2a] rounded-full mb-3">
                <Bot className="h-8 w-8 text-[#d4a574]" />
              </div>
              <p className="text-sm text-[#8e8e8e]">
                Ask me anything about your college
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center space-x-2">
                  {msg.role === 'user' ? (
                    <>
                      <User className="h-4 w-4 text-[#8e8e8e]" />
                      <span className="text-xs font-medium text-[#8e8e8e]">You</span>
                    </>
                  ) : (
                    <>
                      <Bot className="h-4 w-4 text-[#d4a574]" />
                      <span className="text-xs font-medium text-[#d4a574]">PeerAI</span>
                    </>
                  )}
                </div>
                <div className="pl-6">
                  {msg.role === 'user' ? (
                    <p className="text-sm text-[#e8e8e8]">{msg.content}</p>
                  ) : (
                    <ReactMarkdown
                      components={{
                        p: ({children}) => <p className="mb-3 leading-relaxed text-[#e8e8e8] text-sm">{children}</p>,
                        ul: ({children}) => <ul className="list-disc ml-5 mb-3 text-[#e8e8e8] space-y-1 text-sm">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal ml-5 mb-3 text-[#e8e8e8] space-y-1 text-sm">{children}</ol>,
                        li: ({children}) => <li className="text-[#e8e8e8]">{children}</li>,
                        strong: ({children}) => <strong className="font-semibold text-[#d4a574]">{children}</strong>,
                        h1: ({children}) => <h1 className="text-lg font-semibold text-[#e8e8e8] mb-2">{children}</h1>,
                        h2: ({children}) => <h2 className="text-base font-semibold text-[#e8e8e8] mb-2">{children}</h2>,
                        h3: ({children}) => <h3 className="text-sm font-semibold text-[#e8e8e8] mb-2">{children}</h3>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4 text-[#d4a574]" />
                  <span className="text-xs font-medium text-[#d4a574]">PeerAI</span>
                </div>
                <div className="pl-6 space-y-2">
                  <div className="h-3 bg-[#2a2a2a] rounded animate-pulse w-full"></div>
                  <div className="h-3 bg-[#2a2a2a] rounded animate-pulse w-5/6"></div>
                  <div className="h-3 bg-[#2a2a2a] rounded animate-pulse w-4/6"></div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Input Area */}
      <div className="p-4 border-t border-[#2a2a2a]">
        <div className="relative">
          <input
            type="text"
            placeholder="Ask anything..."
            className="w-full px-4 py-3 pr-12 bg-[#2a2a2a] text-[#e8e8e8] border border-[#3a3a3a] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d4a574] focus:border-[#d4a574] placeholder-[#6e6e6e] transition text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
            disabled={loading}
          />
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#d4a574] text-[#1a1a1a] rounded-md hover:bg-[#c49564] focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleQuery}
            disabled={loading || !input.trim()}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAI;
