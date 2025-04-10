import { ArrowLeft, Trash2, Edit2 } from "lucide-react";
import Link from "next/link";
import { JournalEntryDisplay } from "@/utils/types";
import { deleteJournalEntry } from "@/utils/storage";
import { useRouter } from "next/navigation";

interface EntryDetailProps {
  entry: JournalEntryDisplay;
}

export default function EntryDetail({ entry }: EntryDetailProps) {
  const router = useRouter();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this entry?")) {
      deleteJournalEntry(entry.id);
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/entry/${entry.id}/edit`}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Edit2 size={20} />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
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

          {/* Summary */}
          {entry.summary && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-medium text-gray-500 mb-2">
                Summary
              </h2>
              <p className="text-gray-700">{entry.summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
