"use client"
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const ChatAI = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleQuery() {
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/rag", {
        method: "POST",
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();
      setResponse(data.answer);
    } catch (error) {
      setResponse("Error: Failed to get response");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-96 bg-gray-800 p-4 space-y-4 flex flex-col justify-between h-full">
      <div className="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-3">
        PeerAI
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-400">Thinking...</div>
          </div>
        ) : response ? (
          <div className="mt-4 text-gray-300 bg-[#1a1a1a] p-4 rounded-lg prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              components={{
                p: ({children}) => <p className="mb-2 leading-relaxed text-gray-300">{children}</p>,
                ul: ({children}) => <ul className="list-disc ml-4 mb-2 text-gray-300">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal ml-4 mb-2 text-gray-300">{children}</ol>,
                li: ({children}) => <li className="mb-1">{children}</li>,
                strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
              }}
            >
              {response}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Ask me anything about your college!
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Ask anything"
          className="flex-1 px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
          disabled={loading}
        />
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={handleQuery}
          disabled={loading || !input.trim()}
        >
          Ask
        </button>
      </div>
    </div>
  );
};

export default ChatAI;
