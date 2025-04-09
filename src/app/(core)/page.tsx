"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Expand,
  Save,
  X,
  ArrowUp,
  Plus,
  Trash2,
  ChevronUp,
} from "lucide-react";
import { Drawer } from "vaul";
import { JournalEntry, JournalEntryDisplay } from "@/utils/types";
import {
  getJournalEntries,
  saveJournalEntry,
  deleteJournalEntry,
} from "@/utils/storage";
import Link from "next/link";

const JournalEntryCard = ({
  entry,
  onDelete,
}: {
  entry: JournalEntryDisplay;
  onDelete: (id: string) => void;
}) => {
  return (
    <Link href={`/entry/${entry.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 mb-6 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-blue-600">{entry.timestamp}</p>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              onDelete(entry.id);
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{entry.entryDate}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{entry.snippet}</p>
      </div>
    </Link>
  );
};

const InputDrawer = ({ onSave }: { onSave: (entry: JournalEntry) => void }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [newEntryText, setNewEntryText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (textareaRef.current && isOpen) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (newEntryText.trim() === "") return;

    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      text: newEntryText,
      createdAt: new Date().toISOString(),
      images: images,
    };

    try {
      // Try to get AI summary if we have internet access
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newEntryText }),
      });

      if (response.ok) {
        const data = await response.json();
        newEntry.summary = data.summary;
      }
    } catch (error) {
      console.error("Failed to generate summary:", error);
      // Continue without summary if there's an error
    }

    onSave(newEntry);
    setNewEntryText("");
    setImages([]);
    setIsOpen(false);
  };

  const handleScroll = () => {
    if (scrollViewRef.current) {
      const scrollTop = scrollViewRef.current.scrollTop;
      setShowScrollTopButton(scrollTop > 300);
    }
  };

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAddImage = () => {
    // In a real app, this would open a file picker and handle image uploads
    // For now, we'll just simulate adding an image
    const newImage = `placeholder-image-${Date.now()}.jpg`;
    setImages([...images, newImage]);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 flex items-center p-4 bg-white border-t border-gray-100 z-50 shadow-lg">
        <button
          className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-100"
          onClick={() => setIsOpen(true)}
        >
          <Expand size={20} className="text-blue-600" />
        </button>
        <textarea
          placeholder="Write your thoughts..."
          className="flex-grow bg-gray-50 border border-gray-200 rounded-full py-3 px-4 mx-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all"
          value={newEntryText}
          onChange={(e) => setNewEntryText(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          rows={1}
        />
        <button
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            newEntryText.trim() === ""
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
          }`}
          onClick={handleSave}
          disabled={newEntryText.trim() === ""}
        >
          <ArrowUp size={20} className="text-white" />
        </button>
      </div>

      <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[96vh] mt-24 fixed bottom-0 left-0 right-0 z-[101]">
            <div className="p-4 bg-white rounded-t-[10px] flex-1 flex flex-col">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />

              <div className="flex justify-between items-center mb-6 px-4">
                <Drawer.Title className="text-2xl font-semibold text-gray-800">
                  New Entry
                </Drawer.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <X size={24} className="text-blue-600" />
                </button>
              </div>

              <div
                ref={scrollViewRef}
                className="flex-1 overflow-y-auto px-4"
                onScroll={handleScroll}
              >
                <textarea
                  ref={textareaRef}
                  placeholder="Write your thoughts..."
                  className="w-full h-full resize-none border-none focus:outline-none focus:ring-0 text-base p-2 placeholder-gray-400"
                  value={newEntryText}
                  onChange={(e) => setNewEntryText(e.target.value)}
                  autoFocus
                />

                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 mb-4">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center"
                      >
                        <span className="text-xs text-gray-500">
                          Image {index + 1}
                        </span>
                        <button
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          onClick={() =>
                            setImages(images.filter((_, i) => i !== index))
                          }
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl mt-4 mb-4 border border-blue-100 transition-colors"
                  onClick={handleAddImage}
                >
                  <Plus size={24} className="text-blue-600 mr-3" />
                  <span className="text-blue-600 font-medium">Add Images</span>
                </button>
              </div>

              <button
                onClick={handleSave}
                disabled={newEntryText.trim() === ""}
                className={`mx-5 mb-6 py-4 rounded-xl text-center font-semibold text-white transition-all ${
                  newEntryText.trim() === ""
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                }`}
              >
                Save Entry
              </button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {showScrollTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed right-5 bottom-24 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center shadow-lg shadow-blue-200 transition-all z-50"
        >
          <ChevronUp size={24} className="text-white" />
        </button>
      )}
    </>
  );
};

export default function DailyJournalPage() {
  const [entries, setEntries] = useState<JournalEntryDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load entries from localStorage on component mount
    const loadEntries = () => {
      const storedEntries = getJournalEntries();

      // Convert to display format
      const displayEntries: JournalEntryDisplay[] = storedEntries.map(
        (entry) => {
          const date = new Date(entry.createdAt);
          const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const formattedTime = date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
          });

          return {
            id: entry.id,
            timestamp: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            }),
            entryDate: `Journal Entry - ${formattedDate} at ${formattedTime}`,
            snippet:
              entry.text.substring(0, 100) +
              (entry.text.length > 100 ? "..." : ""),
            text: entry.text,
            images: entry.images,
            summary: entry.summary,
          };
        }
      );

      setEntries(displayEntries);
      setIsLoading(false);
    };

    loadEntries();
  }, []);

  const handleSaveEntry = (entry: JournalEntry) => {
    saveJournalEntry(entry);

    // Update the entries state
    const date = new Date(entry.createdAt);
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });

    const newDisplayEntry: JournalEntryDisplay = {
      id: entry.id,
      timestamp: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      }),
      entryDate: `Journal Entry - ${formattedDate} at ${formattedTime}`,
      snippet:
        entry.text.substring(0, 100) + (entry.text.length > 100 ? "..." : ""),
      text: entry.text,
      images: entry.images,
      summary: entry.summary,
    };

    setEntries([newDisplayEntry, ...entries]);
  };

  const handleDeleteEntry = (id: string) => {
    deleteJournalEntry(id);
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pb-32">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No journal entries yet
          </h3>
          <p className="text-gray-500">
            Start writing your first entry by clicking the button below
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {entries.map((entry) => (
            <JournalEntryCard
              key={entry.id}
              entry={entry}
              onDelete={handleDeleteEntry}
            />
          ))}
        </div>
      )}
      <InputDrawer onSave={handleSaveEntry} />
    </div>
  );
}
