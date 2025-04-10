"use client";

import { useState } from "react";
import { Send, Loader2, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBriefMode, setIsBriefMode] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: isBriefMode
          ? "Here's a brief response based on your journal data..."
          : "Here's a detailed response based on your journal data...",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col px-4 pt-2 h-full">
      <div className="flex justify-end pb-2">
        <button
          onClick={() => setIsBriefMode(!isBriefMode)}
          className="rounded-full bg-gray-100 p-1 px-2 text-xs flex items-center gap-1"
        >
          <Briefcase size={16} strokeWidth={2} />
          {isBriefMode ? "Brief" : "Detailed"} Mode
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 ${
                  message.isUser
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200/80"
                }`}
              >
                <p className="text-[15px] leading-snug">{message.content}</p>
                <p
                  className={`text-xs mt-1.5 ${
                    message.isUser ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white rounded-xl px-4 py-2.5 rounded-bl-none shadow-sm border border-gray-200/80">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200/70 bg-white/85 backdrop-blur-lg">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about your journal..."
              className="w-full p-3 pr-12 rounded-lg bg-gray-50 border border-gray-200/80 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       text-[15px] placeholder-gray-500 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg 
                       text-gray-500 hover:text-blue-500 hover:bg-blue-50 
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:bg-transparent
                       transition-colors"
            >
              <Send size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
