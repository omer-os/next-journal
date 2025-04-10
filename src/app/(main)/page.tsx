// app/page.jsx (or your relevant page file)
"use client";

import EntryInput from "@/components/entry-input"; // Adjust path - THIS USES THE FAB VERSION
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const mockData = [
  {
    id: "1",
    timestamp: "10:30 AM",
    entryDate: "August 23, 2023",
    snippet:
      "Started working on the sales rep app. The design is almost finished. Met with Anwar and looking forward to working on projects again.",
  },
  {
    id: "2",
    timestamp: "11:45 AM",
    entryDate: "August 24, 2023",
    snippet:
      "Continued working on the project. Making good progress with the implementation.",
  },
  {
    id: "3",
    timestamp: "2:15 PM",
    entryDate: "August 25, 2023",
    snippet:
      "Finalizing the design and preparing for the next phase of development.",
  },
  {
    id: "4",
    timestamp: "9:00 AM",
    entryDate: "August 26, 2023",
    snippet:
      "Planning meeting for the upcoming sprint. Discussed new features and priorities.",
  },
  {
    id: "5",
    timestamp: "3:30 PM",
    entryDate: "August 27, 2023",
    snippet:
      "Debugging a tricky issue related to state management. Finally found the solution.",
  },
];

export default function Page() {
  return (
    <>
      <div className="space-y-2.5">
        {mockData.map((entry, index) => (
          <Card key={entry.id} entry={entry} index={index} />
        ))}
      </div>

      <EntryInput />
    </>
  );
}

// Card Component - Styled as a clean list item
const Card = ({ entry, index }: { entry: any; index: number }) => {
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
