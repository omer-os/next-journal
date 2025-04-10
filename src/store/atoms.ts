import { atom } from "jotai";

// Sidebar state
export const isSidebarOpenAtom = atom<boolean>(false);

// Entry actions state
export interface EntryActions {
  handleSummarize: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
  isEditMode: boolean;
  isSummarizing: boolean;
}

export const entryActionsAtom = atom<EntryActions>({
  handleSummarize: () => {},
  handleEdit: () => {},
  handleDelete: () => {},
  isEditMode: false,
  isSummarizing: false,
});
