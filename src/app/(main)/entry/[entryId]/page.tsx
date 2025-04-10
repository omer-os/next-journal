"use client";

import { useEffect, useState } from "react";
import { getJournalEntries } from "@/utils/storage";
import { JournalEntryDisplay } from "@/utils/types";
import { useParams } from "next/navigation";

export default function EntryPage() {
  const [entry, setEntry] = useState<JournalEntryDisplay | null>(null);
  const params = useParams();
  const entryId = params.entryId as string;

  useEffect(() => {
    const storedEntries = getJournalEntries();
    const foundEntry = storedEntries.find((entry) => entry.id === entryId);

    if (foundEntry) {
      const formattedEntry: JournalEntryDisplay = {
        id: foundEntry.id,
        timestamp: new Date(foundEntry.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        entryDate: new Date(foundEntry.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        snippet:
          foundEntry.text.slice(0, 100) +
          (foundEntry.text.length > 100 ? "..." : ""),
        text: foundEntry.text,
        images: foundEntry.images,
        summary: foundEntry.summary,
      };
      setEntry(formattedEntry);
    }
  }, [entryId]);

  if (!entry) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-500">Entry not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto rounded-lg p-6">
      <div className="space-y-6">
        {/* Summary */}
        {entry.summary && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 ">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Summary</h2>
            <p className="text-gray-700">{entry.summary}</p>
          </div>
        )}

        {/* Date and Time */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            {entry.entryDate}
          </h1>
          <p className="text-sm text-gray-500">{entry.timestamp}</p>
        </div>

        {/* Entry Text */}
        <div className="prose prose-lg max-w-none">
          <p className="whitespace-pre-wrap text-gray-800">{entry.text}</p>
        </div>

        {/* Images */}
        {entry.images && entry.images.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {entry.images.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={image}
                  alt={`Entry image ${index + 1}`}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
