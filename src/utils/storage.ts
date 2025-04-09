import { JournalEntry } from "./types";

const STORAGE_KEY = "next-journal-entries";

export const getJournalEntries = (): JournalEntry[] => {
  if (typeof window === "undefined") return [];

  try {
    const storedEntries = localStorage.getItem(STORAGE_KEY);
    return storedEntries ? JSON.parse(storedEntries) : [];
  } catch (error) {
    console.error("Error reading journal entries from localStorage:", error);
    return [];
  }
};

export const saveJournalEntry = (entry: JournalEntry): void => {
  if (typeof window === "undefined") return;

  try {
    const entries = getJournalEntries();
    entries.unshift(entry); // Add new entry at the beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving journal entry to localStorage:", error);
  }
};

export const deleteJournalEntry = (id: string): void => {
  if (typeof window === "undefined") return;

  try {
    const entries = getJournalEntries();
    const filteredEntries = entries.filter((entry) => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
  } catch (error) {
    console.error("Error deleting journal entry from localStorage:", error);
  }
};

export const updateJournalEntry = (updatedEntry: JournalEntry): void => {
  if (typeof window === "undefined") return;

  try {
    const entries = getJournalEntries();
    const updatedEntries = entries.map((entry) =>
      entry.id === updatedEntry.id ? updatedEntry : entry
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
  } catch (error) {
    console.error("Error updating journal entry in localStorage:", error);
  }
};

export const clearAllEntries = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error(
      "Error clearing all journal entries from localStorage:",
      error
    );
  }
};
