"use client";
import EntryInput from "@/components/entry-input";
import { ChevronRight, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";

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
];

export default function Page() {
  return (
    <div className="flex flex-col flex-1">
      <div className="p-4 flex flex-col flex-1 gap-4">
        {mockData.map((entry) => (
          <Card key={entry.id} entry={entry} />
        ))}
      </div>

      <div className="p-4">
        <EntryInput />
      </div>
    </div>
  );
}

const Card = ({
  entry,
}: {
  entry: {
    id: string;
    timestamp: string;
    entryDate: string;
    snippet: string;
  };
}) => {
  return (
    <Link href={`/entry/${entry.id}`} className="block relative">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 border border-gray-100">
        <div className="text-zinc-500 absolute top-4 right-4">
          <ChevronRight size={16} />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{entry.entryDate}</h3>
        <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
          {entry.snippet}
        </p>
      </div>
    </Link>
  );
};
