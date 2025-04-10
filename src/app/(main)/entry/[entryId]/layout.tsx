"use client";

import React, { useState } from "react";
import { ArrowLeft, Pencil, Trash2, FileText, Save } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  getJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
} from "@/utils/storage";
import { JournalEntry } from "@/utils/types";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");
  const router = useRouter();
  const params = useParams();
  const entryId = params.entryId as string;

  const handleEdit = () => {
    const storedEntries = getJournalEntries();
    const foundEntry = storedEntries.find((entry) => entry.id === entryId);
    if (foundEntry) {
      setText(foundEntry.text);
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (!text.trim()) return;

    const updatedEntry: JournalEntry = {
      id: entryId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      images: [],
    };

    updateJournalEntry(updatedEntry);
    setIsEditing(false);
    router.refresh();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this entry?")) {
      deleteJournalEntry(entryId);
      router.push("/");
    }
  };

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
              {isEditing ? "Edit Entry" : "Journal Details"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-lg p-2 text-blue-600 hover:bg-blue-50"
              >
                <Save className="h-5 w-5" />
                Save
              </button>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 rounded-lg p-2 text-gray-700 hover:bg-gray-100"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 rounded-lg p-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg p-2 text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto bg-gray-50">
        {isEditing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your thoughts..."
            className="w-full h-full p-4 text-gray-800 focus:outline-none resize-none bg-white rounded-lg"
          />
        ) : (
          children
        )}
      </main>
    </div>
  );
}
