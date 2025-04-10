import { Menu } from "lucide-react";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="flex sticky z-30 top-0 left-0 bg-white shadow-lg px-4 py-2 justify-between items-center">
        <div className="flex gap-1 items-center">
          <button className="h-12 w-12 flex items-center justify-center rounded-lg hover:bg-zinc-100 cursor-pointer">
            <Menu size={24} />
          </button>
          <p className="text-xl font-bold">Next Journal</p>
        </div>
      </nav>
      {children}
    </div>
  );
}
