"use client";

import React from "react";
import { ArrowLeft, Pencil, Trash2, FileText } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <nav className="flex h-16 items-center border-b border-gray-200 bg-white px-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">
              Journal Details
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            >
              <FileText className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">{children}</main>
    </div>
  );
}
