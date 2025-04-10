// app/page.jsx (or your relevant page file)
"use client";

import EntryInput from "@/components/entry-input";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { JournalEntryDisplay } from "@/utils/types";
import { getJournalEntries } from "@/utils/storage";

export default function Page() {
  const [entries, setEntries] = useState<JournalEntryDisplay[]>([]);

  useEffect(() => {
    const storedEntries = getJournalEntries();
    const formattedEntries: JournalEntryDisplay[] = storedEntries.map(
      (entry) => ({
        id: entry.id,
        timestamp: new Date(entry.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        entryDate: new Date(entry.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        snippet:
          entry.text.slice(0, 100) + (entry.text.length > 100 ? "..." : ""),
        text: entry.text,
        images: entry.images,
        summary: entry.summary,
      })
    );
    setEntries(formattedEntries);
  }, []);

  return (
    <div className="px-4 py-5">
      <div className="space-y-2.5">
        {entries.map((entry, index) => (
          <Card key={entry.id} entry={entry} index={index} />
        ))}
      </div>

      <EntryInput
        onEntryAdded={() => {
          const storedEntries = getJournalEntries();
          const formattedEntries: JournalEntryDisplay[] = storedEntries.map(
            (entry) => ({
              id: entry.id,
              timestamp: new Date(entry.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              entryDate: new Date(entry.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
              snippet:
                entry.text.slice(0, 100) +
                (entry.text.length > 100 ? "..." : ""),
              text: entry.text,
              images: entry.images,
              summary: entry.summary,
            })
          );
          setEntries(formattedEntries);
        }}
      />
    </div>
  );
}

// Card Component - Styled as a clean list item
const Card = ({
  entry,
  index,
}: {
  entry: JournalEntryDisplay;
  index: number;
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.25, 0.1, 0.25, 1.0],
      }, // Smoother ease, staggered delay
    },
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Link
        href={`/entry/${entry.id}`}
        className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200/80 
                   hover:bg-gray-50 active:bg-gray-100 active:scale-[0.99] 
                   transition-all duration-150 cursor-pointer group shadow-sm hover:shadow-md"
      >
        {/* Content */}
        <div className="flex-grow overflow-hidden mr-3">
          <p className="text-xs font-medium text-gray-500 mb-1.5 truncate">
            {entry.entryDate} &middot; {entry.timestamp}{" "}
            {/* Cleaner date/time format */}
          </p>
          <p className="text-[15px] text-gray-800 line-clamp-2 leading-snug">
            {" "}
            {/* Slightly larger snippet text */}
            {entry.snippet}
          </p>
        </div>
        {/* Chevron Indicator */}
        <div className="flex-shrink-0 text-gray-300 group-hover:text-gray-500 transition-colors">
          <ChevronRight size={20} strokeWidth={2.5} />
        </div>
      </Link>
    </motion.div>
  );
};
