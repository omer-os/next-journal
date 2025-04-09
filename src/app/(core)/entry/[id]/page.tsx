"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, X, Plus } from "lucide-react";
import { JournalEntry } from "@/utils/types";
import {
  getJournalEntries,
  deleteJournalEntry,
  updateJournalEntry,
} from "@/utils/storage";
import { EntryActionContext } from "@/app/(core)/layout";

export default function EntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const entryId = params.id as string;

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const [editImages, setEditImages] = useState<string[]>([]);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    const loadEntry = () => {
      if (!entryId) {
        setError("Invalid Entry ID.");
        setIsLoading(false);
        return;
      }

      try {
        const entries = getJournalEntries();
        const foundEntry = entries.find((entry) => entry.id === entryId);

        if (foundEntry) {
          setEntry(foundEntry);
          setEditText(foundEntry.text);
          setEditImages(foundEntry.images || []);
        } else {
          setError("Entry not found.");
        }
      } catch (err) {
        console.error("Failed to fetch entry:", err);
        setError("Failed to load the entry.");
      } finally {
        setIsLoading(false);
      }
    };

    loadEntry();
  }, [entryId]);

  const handleBack = () => {
    router.back();
  };

  const handleCopyEntry = () => {
    if (!entry) return;

    let textToCopy = entry.text;

    // Add date information
    const formattedDate = formatDate(entry.createdAt);
    textToCopy = `Journal Entry - ${formattedDate}\n\n${textToCopy}`;

    // Add image count if there are images
    if (entry.images && entry.images.length > 0) {
      textToCopy += `\n\n[Entry contains ${entry.images.length} image${
        entry.images.length > 1 ? "s" : ""
      }]`;
    }

    navigator.clipboard.writeText(textToCopy);
    alert("Entry text has been copied to clipboard");
  };

  const handleEdit = () => {
    if (!entry) return;
    setEditText(entry.text);
    setEditImages(entry.images || []);
    setIsEditMode(true);
  };

  const handleDeleteConfirm = () => {
    if (!entryId) return;

    if (confirm("Are you sure you want to delete this entry?")) {
      try {
        deleteJournalEntry(entryId);
        router.back();
      } catch (error) {
        console.error("Failed to delete entry:", error);
        alert("Could not delete the entry.");
      }
    }
  };

  const handleAddImage = () => {
    // In a real app, this would open a file picker and handle image uploads
    // For now, we'll just simulate adding an image
    const newImage = `placeholder-image-${Date.now()}.jpg`;
    setEditImages([...editImages, newImage]);
  };

  const removeImage = (index: number) => {
    setEditImages(editImages.filter((_, i) => i !== index));
  };

  const handleSaveEdit = () => {
    if (!entry) return;

    const trimmedText = editText.trim();
    if (trimmedText === "" && editImages.length === 0) {
      alert("Entry cannot be empty.");
      return;
    }

    try {
      const updatedEntry: JournalEntry = {
        ...entry,
        text: trimmedText,
        updatedAt: new Date().toISOString(),
        images: editImages.length > 0 ? editImages : [],
      };

      updateJournalEntry(updatedEntry);
      setEntry(updatedEntry);
      setIsEditMode(false);
    } catch (err) {
      console.error("Failed to update entry:", err);
      alert("Could not update the entry.");
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString(undefined, {
      dateStyle: "full",
      timeStyle: "short",
    });
  };

  const handleSummarize = async () => {
    if (!entry) return;

    setIsSummarizing(true);
    try {
      // In a real app, this would call an API to summarize the text
      // For now, we'll just simulate a summary
      const summary = `This is a simulated summary of the entry: "${entry.text.substring(
        0,
        50
      )}..."`;

      const updatedEntry: JournalEntry = {
        ...entry,
        summary: summary,
        updatedAt: new Date().toISOString(),
      };

      updateJournalEntry(updatedEntry);
      setEntry(updatedEntry);
      alert("Entry has been summarized!");
    } catch (err) {
      console.error("Failed to summarize entry:", err);
      alert(
        `Could not summarize the entry: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsSummarizing(false);
    }
  };

  // Provide context values for the action buttons in the layout
  const contextValue = {
    handleSummarize,
    handleEdit,
    handleDelete: handleDeleteConfirm,
    isEditMode,
    isSummarizing,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-6">
        <p className="text-red-500 text-lg mb-4">
          {error || "Entry not found"}
        </p>
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <EntryActionContext.Provider value={contextValue}>
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Journal Entry</h1>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(entry.createdAt)}
            </p>
          </div>
          {isEditMode && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditMode(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {entry.summary && !isEditMode && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
            <h3 className="text-sm font-semibold text-blue-700 mb-2">
              Summary
            </h3>
            <p className="text-sm text-gray-700">{entry.summary}</p>
          </div>
        )}

        {isEditMode ? (
          <div className="space-y-4">
            <textarea
              placeholder="Write your thoughts..."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
            />

            <div className="flex flex-wrap gap-2 mb-4">
              {editImages.map((image, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  <span className="text-xs text-gray-500">
                    Image {index + 1}
                  </span>
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    onClick={() => removeImage(index)}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              onClick={handleAddImage}
            >
              <Plus size={18} />
              Add Images
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-700 whitespace-pre-wrap">{entry.text}</p>

            {entry.images && entry.images.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  Images ({entry.images.length})
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {entry.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center"
                    >
                      <span className="text-sm text-gray-500">
                        Image {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </EntryActionContext.Provider>
  );
}
