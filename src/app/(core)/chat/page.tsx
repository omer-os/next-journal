import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg max-w-[80%]">
            <p className="text-sm text-gray-600">
              Hello! I'm your AI journal assistant. How can I help you today?
            </p>
          </div>
        </div>

        <form className="flex gap-2">
          <input
            type="text"
            placeholder="Ask about your journal entries..."
            className="flex-1 rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </main>
  );
}
