export interface JournalEntry {
  id: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
  images: string[];
  summary?: string;
}

export interface JournalEntryDisplay {
  id: string;
  timestamp: string;
  entryDate: string;
  snippet: string;
  text: string;
  images: string[];
  summary?: string;
}
